import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";

import { isVyxiaModel } from "@/lib/vyxia-models";

import { createGatewayRunIdFetch, getGatewayRunId } from "./gateway-run-id.server";

export function createVyxiaModel(request: Request, modelId: string) {
  if (!isVyxiaModel(modelId)) throw new Error("Choose one of the available Vyxia models.");
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("Lovable AI is not configured for this project.");
  const gateway = createGatewayRunIdFetch(getGatewayRunId(request));
  const baseURL = "https://ai.gateway.lovable.dev/v1";
  const model: LanguageModel = modelId.startsWith("anthropic/")
    ? createAnthropic({
        baseURL,
        apiKey,
        headers: { "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
        fetch: gateway.fetch,
      })(modelId)
    : createOpenAI({
        baseURL,
        apiKey,
        headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
        fetch: gateway.fetch,
      }).responses(modelId);
  return { model, gateway };
}