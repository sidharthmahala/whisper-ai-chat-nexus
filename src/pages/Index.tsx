
import { useState, useEffect } from "react";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useChatStore } from "@/store/chatStore";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const createSession = useChatStore(state => state.createSession);
  const currentSessionId = useChatStore(state => state.currentSessionId);
  
  useEffect(() => {
    // Initialize with sidebar collapsed on mobile
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [isMobile]);
  
  useEffect(() => {
    // Create a session if none exists
    if (!currentSessionId) {
      createSession();
    }
  }, [currentSessionId, createSession]);
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <ThemeProvider defaultTheme="system">
      <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
        {!sidebarCollapsed && (
          <ChatSidebar 
            isCollapsed={false} 
            onToggle={toggleSidebar}
          />
        )}
        <ChatInterface 
          className="flex-1" 
          onToggleSidebar={toggleSidebar} 
          isSidebarCollapsed={sidebarCollapsed}
        />
      </div>
    </ThemeProvider>
  );
};

export default Index;
