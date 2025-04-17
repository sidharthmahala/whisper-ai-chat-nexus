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

// Helper to generate a summary based on the first few messages
const generateChatSummary = (messages: ChatMessage[]): string => {
  if (messages.length === 0) return "New Chat";
  
  // Use the first user message as the summary
  const firstUserMessage = messages.find(msg => msg.role === "user");
  
  if (firstUserMessage) {
    // Limit the summary to a reasonable length
    const content = firstUserMessage.content;
    const maxLength = 30;
    
    if (content.length <= maxLength) {
      return content;
    } else {
      return `${content.substring(0, maxLength)}...`;
    }
  }
  
  return "New Chat";
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSessionId: null,
      settings: defaultSettings,
      isProcessing: false,
      
      createSession: () => {
        // Check if current session exists and has no messages
        const currentSession = get().getCurrentSession();
        
        // If there's a current session with no messages, just return that session's ID instead of creating a new one
        if (currentSession && currentSession.messages.length === 0) {
          return currentSession.id;
        }
        
        // Otherwise, create a new session as before
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
          set((state) => {
            // Get the updated session with the new message
            const updatedSession = { 
              ...state.sessions.find(s => s.id === newSessionId)!,
              messages: [{ 
                id: uuidv4(), 
                ...message, 
                timestamp: Date.now() 
              }],
              updatedAt: Date.now()
            };
            
            // Generate a summary for the title if this is the first user message
            const newTitle = message.role === "user" 
              ? generateChatSummary([{ id: uuidv4(), ...message, timestamp: Date.now() }])
              : updatedSession.title;
            
            return {
              sessions: state.sessions.map((session) => 
                session.id === newSessionId 
                  ? { 
                      ...updatedSession,
                      title: newTitle
                    }
                  : session
              ),
            };
          });
        } else {
          set((state) => {
            const currentSession = state.sessions.find(s => s.id === currentSessionId);
            if (!currentSession) return state;
            
            const updatedMessages = [...currentSession.messages, { 
              id: uuidv4(), 
              ...message, 
              timestamp: Date.now() 
            }];
            
            // Only update the title if this is the first user message in the conversation
            const newTitle = currentSession.messages.length === 0 && message.role === "user"
              ? generateChatSummary([{ id: uuidv4(), ...message, timestamp: Date.now() }])
              : currentSession.title;
            
            return {
              sessions: state.sessions.map((session) => 
                session.id === currentSessionId 
                  ? { 
                      ...session, 
                      messages: updatedMessages,
                      title: newTitle,
                      updatedAt: Date.now()
                    }
                  : session
              ),
            };
          });
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
