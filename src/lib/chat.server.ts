import { convertToModelMessages, safeValidateUIMessages, streamText, type UIMessage } from "ai";

import type { Database } from "@/integrations/supabase/types";
import { getAuthenticatedRequest } from "@/lib/request-auth.server";

import { createVyxiaModel } from "./ai-model.server";
import { withGatewayRunIdHeader } from "./gateway-run-id.server";
import { isVyxiaModel } from "./vyxia-models";

function messageText(message: UIMessage) {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("\n");
}

async function saveMessages(
  client: NonNullable<Awaited<ReturnType<typeof getAuthenticatedRequest>>>["client"],
  userId: string,
  threadId: string,
  messages: UIMessage[],
  modelId: string,
) {
  const rows = messages
    .filter((message) => message.role === "user" || message.role === "assistant")
    .map((message) => ({
      thread_id: threadId,
      user_id: userId,
      role: message.role,
      content: messageText(message),
      parts: JSON.parse(JSON.stringify(message.parts)) as Database["public"]["Tables"]["chat_messages"]["Insert"]["parts"],
      ai_message_id: message.id,
      ai_model: message.role === "assistant" ? modelId : null,
    }));
  if (rows.length === 0) return;
  const { error } = await client.from("chat_messages").upsert(rows, {
    onConflict: "thread_id,ai_message_id",
  });
  if (error) throw error;
  const lastUser = [...messages].reverse().find((message) => message.role === "user");
  if (lastUser) {
    const title = messageText(lastUser).trim().slice(0, 72);
    await client.from("threads").update({ title: title || "New conversation", updated_at: new Date().toISOString() }).eq("id", threadId);
  }
}

export async function handleChat(request: Request) {
  const auth = await getAuthenticatedRequest(request);
  if (!auth) return Response.json({ error: "Please sign in again to continue." }, { status: 401 });

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return Response.json({ error: "The chat request could not be read." }, { status: 400 });
  }
  if (typeof input !== "object" || input === null) {
    return Response.json({ error: "The chat request is invalid." }, { status: 400 });
  }
  const body = input as { id?: unknown; messages?: unknown; model?: unknown; lessonId?: unknown };
  if (typeof body.id !== "string" || !isVyxiaModel(body.model) || !Array.isArray(body.messages)) {
    return Response.json({ error: "Choose a conversation and one of the available tutor models." }, { status: 400 });
  }

  const { data: thread } = await auth.client
    .from("threads")
    .select("id, lesson_id")
    .eq("id", body.id)
    .eq("user_id", auth.user.id)
    .maybeSingle();
  if (!thread) return Response.json({ error: "This conversation is not available." }, { status: 404 });

  const checked = await safeValidateUIMessages({ messages: body.messages });
  if (!checked.success) return Response.json({ error: "One of the chat messages is invalid." }, { status: 400 });
  const messages = checked.data as UIMessage[];
  if (messages.some((message) => message.role === "system")) {
    return Response.json({ error: "System messages are not accepted." }, { status: 400 });
  }

  const lessonId = typeof body.lessonId === "string" ? body.lessonId : thread.lesson_id;
  let lessonContext = "No specific lesson is selected. Help the student navigate the Pure Mathematics textbook.";
  if (lessonId) {
    const { data: lesson } = await auth.client
      .from("lessons")
      .select("title, unit_title, content, page_start, page_end")
      .eq("id", lessonId)
      .maybeSingle();
    if (lesson) {
      lessonContext = `Current textbook lesson: ${lesson.title}\nUnit: ${lesson.unit_title}\nBook pages: ${lesson.page_start}–${lesson.page_end}\n\nLesson source:\n${lesson.content}`;
    }
  }

  try {
    const { model, gateway } = createVyxiaModel(request, body.model);
    const result = streamText({
      model,
      system: `You are Vyxia, a patient mathematics tutor for a first-secondary applied-technology student in Egypt. Explain in clear Egyptian Arabic unless the student asks for English. Preserve mathematical notation, show steps, ask a short guiding question when it helps, and never invent textbook details. Use this textbook context when relevant:\n\n${lessonContext}`,
      messages: await convertToModelMessages(messages),
      abortSignal: request.signal,
      maxRetries: 0,
    });
    const response = result.toUIMessageStreamResponse({
      originalMessages: messages,
      sendReasoning: true,
      onFinish: async ({ messages: completedMessages }) => {
        await saveMessages(auth.client, auth.user.id, body.id as string, completedMessages as UIMessage[], body.model as string);
      },
    });
    return withGatewayRunIdHeader(response, gateway);
  } catch (error) {
    if (request.signal.aborted || (error instanceof Error && error.name === "AbortError")) {
      return new Response(null, { status: 499 });
    }
    const message = error instanceof Error ? error.message : "The tutor could not answer right now.";
    return Response.json({ error: message }, { status: 500 });
  }
}