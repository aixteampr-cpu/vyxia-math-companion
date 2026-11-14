CREATE TABLE public.chat_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES public.threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  bucket_id TEXT NOT NULL CHECK (bucket_id IN ('vyxia-student-files', 'vyxia-generated-infographics')),
  object_path TEXT NOT NULL,
  filename TEXT NOT NULL,
  media_type TEXT NOT NULL,
  message_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (bucket_id, object_path)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_attachments TO authenticated;
GRANT ALL ON public.chat_attachments TO service_role;
ALTER TABLE public.chat_attachments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can read their Vyxia attachments" ON public.chat_attachments FOR SELECT TO authenticated USING (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.threads t WHERE t.id = thread_id AND t.user_id = auth.uid()));
CREATE POLICY "Students can create their Vyxia attachments" ON public.chat_attachments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.threads t WHERE t.id = thread_id AND t.user_id = auth.uid()));
CREATE POLICY "Students can update their Vyxia attachments" ON public.chat_attachments FOR UPDATE TO authenticated USING (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.threads t WHERE t.id = thread_id AND t.user_id = auth.uid())) WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.threads t WHERE t.id = thread_id AND t.user_id = auth.uid()));
CREATE POLICY "Students can delete their Vyxia attachments" ON public.chat_attachments FOR DELETE TO authenticated USING (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.threads t WHERE t.id = thread_id AND t.user_id = auth.uid()));
CREATE INDEX chat_attachments_thread_created_idx ON public.chat_attachments (thread_id, created_at);