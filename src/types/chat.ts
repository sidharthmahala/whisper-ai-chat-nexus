
export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  modelId: string;
  createdAt: number;
  updatedAt: number;
}

export interface ChatSettings {
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
}

export interface ChatState {
  sessions: ChatSession[];
  currentSessionId: string | null;
  settings: ChatSettings;
  isProcessing: boolean;
  
  // Methods
  createSession: () => string;
  setCurrentSession: (sessionId: string) => void;
  renameSession: (sessionId: string, newTitle: string) => void;
  deleteSession: (sessionId: string) => void;
  addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  updateSettings: (newSettings: Partial<ChatSettings>) => void;
  setModelForCurrentSession: (modelId: string) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  getCurrentSession: () => ChatSession | null;
}
