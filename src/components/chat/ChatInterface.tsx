
import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { ChatMessage, TypingIndicator } from "./ChatMessage";
import { useChatStore } from "@/store/chatStore";
import { chatService } from "@/services/chatService";
import { useToast } from "@/hooks/use-toast";
import { ChatSettings } from "./ChatSettings";

interface ChatInterfaceProps {
  className?: string;
}

export function ChatInterface({ 
  className
}: ChatInterfaceProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const { 
    addMessage, 
    isProcessing, 
    setIsProcessing,
    getCurrentSession,
    settings
  } = useChatStore();
  
  const currentSession = getCurrentSession();
  
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [currentSession?.messages, isProcessing]);
  
  const handleSendMessage = async (content: string) => {
    if (!currentSession) return;
    
    // Add user message
    addMessage({ role: "user", content });
    
    try {
      setIsProcessing(true);
      
      // Get AI response
      const response = await chatService.sendMessage(
        content, 
        currentSession.messages, 
        currentSession.modelId,
        settings
      );
      
      // Add AI response
      addMessage({ role: "assistant", content: response });
    } catch (error) {
      console.error("Error getting AI response:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get AI response",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <ChatHeader 
        onSettingsClick={() => setSettingsOpen(true)} 
      />
      
      <ScrollArea 
        ref={scrollAreaRef} 
        className="flex-1"
      >
        <div className="pt-4 pb-16">
          {(currentSession?.messages || []).map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isProcessing && <TypingIndicator />}
          
          {!isProcessing && (currentSession?.messages || []).length === 0 && (
            <div className="flex items-center justify-center h-full min-h-[50vh] text-center p-8">
              <div className="max-w-md">
                <h2 className="text-2xl font-bold mb-2">Welcome to AI Chat Nexus</h2>
                <p className="text-muted-foreground mb-6">
                  Choose an AI model from the top menu and start chatting.
                </p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <ChatInput onSubmit={handleSendMessage} isDisabled={isProcessing} />
      
      <ChatSettings open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}
