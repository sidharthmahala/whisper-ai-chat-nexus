
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { ChatMessage, ChatSession, ChatSettings, ChatState } from "../types/chat";
import { defaultModel } from "../data/models";

const DEFAULT_SYSTEM_PROMPT = "You are a helpful AI assistant.";

const defaultSettings: ChatSettings = {
  systemPrompt: DEFAULT_SYSTEM_PROMPT,
  temperature: 0.7,
  maxTokens: 1000,
};

const createNewSession = (): ChatSession => ({
  id: uuidv4(),
  title: "New Chat",
  messages: [],
  modelId: defaultModel.id,
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSessionId: null,
      settings: defaultSettings,
      isProcessing: false,
      
      createSession: () => {
        const newSession = createNewSession();
        set((state) => ({
          sessions: [newSession, ...state.sessions],
          currentSessionId: newSession.id,
        }));
        return newSession.id;
      },
      
      setCurrentSession: (sessionId: string) => {
        set({ currentSessionId: sessionId });
      },
      
      renameSession: (sessionId: string, newTitle: string) => {
        set((state) => ({
          sessions: state.sessions.map((session) => 
            session.id === sessionId 
              ? { ...session, title: newTitle, updatedAt: Date.now() }
              : session
          ),
        }));
      },
      
      deleteSession: (sessionId: string) => {
        set((state) => {
          const newSessions = state.sessions.filter((s) => s.id !== sessionId);
          const newCurrentId = state.currentSessionId === sessionId
            ? newSessions.length > 0 ? newSessions[0].id : null
            : state.currentSessionId;
            
          return {
            sessions: newSessions,
            currentSessionId: newCurrentId,
          };
        });
      },
      
      addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => {
        const { currentSessionId, sessions } = get();
        
        if (!currentSessionId) {
          const newSessionId = get().createSession();
          set((state) => ({
            sessions: state.sessions.map((session) => 
              session.id === newSessionId 
                ? { 
                    ...session, 
                    messages: [...session.messages, { 
                      id: uuidv4(), 
                      ...message, 
                      timestamp: Date.now() 
                    }],
                    updatedAt: Date.now()
                  }
                : session
            ),
          }));
        } else {
          set((state) => ({
            sessions: state.sessions.map((session) => 
              session.id === currentSessionId 
                ? { 
                    ...session, 
                    messages: [...session.messages, { 
                      id: uuidv4(), 
                      ...message, 
                      timestamp: Date.now() 
                    }],
                    updatedAt: Date.now()
                  }
                : session
            ),
          }));
        }
      },
      
      updateSettings: (newSettings: Partial<ChatSettings>) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },
      
      setModelForCurrentSession: (modelId: string) => {
        const { currentSessionId } = get();
        if (currentSessionId) {
          set((state) => ({
            sessions: state.sessions.map((session) => 
              session.id === currentSessionId 
                ? { ...session, modelId, updatedAt: Date.now() }
                : session
            ),
          }));
        }
      },
      
      setIsProcessing: (isProcessing: boolean) => {
        set({ isProcessing });
      },
      
      getCurrentSession: () => {
        const { currentSessionId, sessions } = get();
        return sessions.find((s) => s.id === currentSessionId) || null;
      },
    }),
    {
      name: "chat-store",
    }
  )
);

// Add zustand type-safe helpers
export type ChatStore = ReturnType<typeof useChatStore.getState>;

// Initialize with a default chat if needed
if (useChatStore.getState().sessions.length === 0) {
  useChatStore.getState().createSession();
}
