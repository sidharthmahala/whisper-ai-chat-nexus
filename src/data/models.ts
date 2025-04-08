
export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  strengths: string[];
  useCases: string[];
  icon: string;
}

export const aiModels: AIModel[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    description: "OpenAI's most advanced model, with broad general knowledge and domain expertise.",
    strengths: ["Broad knowledge", "Complex reasoning", "Nuanced instructions", "Creative content"],
    useCases: ["Research", "Code generation", "Creative writing", "Problem-solving"],
    icon: "sparkles"
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "OpenAI",
    description: "Smaller, faster version of GPT-4o with high accuracy at a lower cost.",
    strengths: ["Fast responses", "Efficient knowledge", "Cost-effective", "Good accuracy"],
    useCases: ["Quick answers", "Simple tasks", "General information", "Drafting content"],
    icon: "zap"
  },
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    provider: "Anthropic",
    description: "Anthropic's most capable model, with excellent reasoning and thoughtfulness.",
    strengths: ["Deep reasoning", "Thoughtful responses", "Meticulous", "Good judgment"],
    useCases: ["Complex explanations", "Decision support", "Detailed analysis", "Careful content"],
    icon: "brain"
  },
  {
    id: "claude-3-sonnet",
    name: "Claude 3 Sonnet",
    provider: "Anthropic",
    description: "Balanced model for mainstream applications requiring reasoning quality.",
    strengths: ["Balanced capabilities", "Good reasoning", "Helpful responses", "Efficiency"],
    useCases: ["Customer support", "Content creation", "Education", "Productivity"],
    icon: "book-open"
  },
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    provider: "Google",
    description: "Google's advanced model with impressive multimodal capabilities.",
    strengths: ["Strong reasoning", "Multimodal understanding", "Long contexts", "Safety features"],
    useCases: ["Image understanding", "Long documents", "Extended conversations", "Professional tasks"],
    icon: "diamond"
  },
  {
    id: "mistral-large",
    name: "Mistral Large",
    provider: "Mistral AI",
    description: "Mistral's flagship model with sophisticated reasoning capabilities.",
    strengths: ["Efficiency", "Mathematical abilities", "Code understanding", "Logical reasoning"],
    useCases: ["Data analysis", "Scientific computation", "Code review", "Technical documentation"],
    icon: "wind"
  }
];

export const defaultModel = aiModels[0];
