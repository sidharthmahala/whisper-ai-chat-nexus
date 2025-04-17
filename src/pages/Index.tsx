
import { useState, useEffect } from "react";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useChatStore } from "@/store/chatStore";
import { useIsMobile } from "@/hooks/use-mobile";
import { NavbarToggle } from "@/components/chat/NavbarToggle";

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
      <div className="flex h-screen w-full overflow-hidden bg-background text-foreground relative">
        {/* Fixed toggle button in top-left corner */}
        <div className="fixed top-4 left-4 z-50">
          <NavbarToggle 
            isCollapsed={sidebarCollapsed} 
            onToggle={toggleSidebar}
          />
        </div>
        
        {/* Main layout */}
        <div className="flex flex-col w-full h-screen">
          {/* Header area remains fixed at top */}
          <div className="h-[53px] w-full flex-shrink-0">
            {/* This space is reserved for the header */}
          </div>
          
          {/* Content area with sidebar and chat */}
          <div className="flex flex-1 overflow-hidden relative">
            {/* Floating sidebar with higher z-index */}
            <div className={`fixed top-[53px] left-0 z-40 h-[calc(100%-53px)] transition-transform duration-300 ${
              sidebarCollapsed ? '-translate-x-full' : 'translate-x-0'
            }`}>
              <ChatSidebar 
                isCollapsed={false} 
                onToggle={toggleSidebar}
              />
            </div>
            
            {/* Main content area */}
            <div className="flex-1 w-full">
              <ChatInterface className="h-full" />
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
