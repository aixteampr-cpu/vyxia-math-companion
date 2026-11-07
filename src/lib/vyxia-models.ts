export const VYXIA_MODELS = [
  {
    id: "openai/gpt-6-astra",
    label: "GPT Astra 6",
    shortLabel: "Astra 6",
    family: "openai" as const,
  },
  {
    id: "anthropic/claude-opus-5-5",
    label: "Claude Opus 5.5",
    shortLabel: "Opus 5.5",
    family: "anthropic" as const,
  },
  {
    id: "anthropic/claude-fable-5-1",
    label: "Claude Fable 5.1",
    shortLabel: "Fable 5.1",
    family: "anthropic" as const,
  },
] as const;

export type VyxiaModel = (typeof VYXIA_MODELS)[number]["id"];

export const DEFAULT_VYXIA_MODEL: VyxiaModel = "anthropic/claude-opus-5-5";

export function isVyxiaModel(value: unknown): value is VyxiaModel {
  return typeof value === "string" && VYXIA_MODELS.some((model) => model.id === value);
}

export const VYXIA_MODEL_COPY: Record<VyxiaModel, string> = {
  "openai/gpt-6-astra": "GPT Astra 6",
  "anthropic/claude-opus-5-5": "Claude Opus 5.5",
  "anthropic/claude-fable-5-1": "Claude Fable 5.1",
};