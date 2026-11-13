ALTER TABLE public.threads
ADD COLUMN model_id TEXT NOT NULL DEFAULT 'anthropic/claude-opus-5-5';

ALTER TABLE public.threads
ADD CONSTRAINT threads_model_id_allowed
CHECK (model_id IN ('openai/gpt-6-astra', 'anthropic/claude-opus-5-5', 'anthropic/claude-fable-5-1'));

CREATE INDEX quizzes_user_created_idx ON public.quizzes (user_id, created_at DESC);