
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/store/chatStore";
import { useState } from "react";
import { 
  PlusCircle, 
  MessageSquare, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  ChevronLeft, 
  ChevronRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChatSidebarProps {
  className?: string;
  isCollapsed: boolean;
  onToggle: () => void;
}

export function ChatSidebar({
  className,
  isCollapsed,
  onToggle,
}: ChatSidebarProps) {
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const isMobile = useIsMobile();
  
  const { 
    sessions, 
    currentSessionId, 
    createSession, 
    deleteSession, 
    setCurrentSession, 
    renameSession 
  } = useChatStore();

  const handleNewChat = () => {
    createSession();
  };

  const handleSelectChat = (sessionId: string) => {
    setCurrentSession(sessionId);
    if (isMobile) {
      onToggle();
    }
  };

  const startRenaming = (sessionId: string, currentTitle: string) => {
    setRenamingId(sessionId);
    setNewTitle(currentTitle);
  };

  const confirmRename = (sessionId: string) => {
    if (newTitle.trim()) {
      renameSession(sessionId, newTitle.trim());
    }
    setRenamingId(null);
  };

  const cancelRename = () => {
    setRenamingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, sessionId: string) => {
    if (e.key === "Enter") {
      confirmRename(sessionId);
    } else if (e.key === "Escape") {
      cancelRename();
    }
  };

  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center py-4 h-screen bg-sidebar border-r">
        <Button
          variant="outline"
          size="icon"
          onClick={onToggle}
          className="mb-2"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNewChat}
          className="mb-2"
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
        <ScrollArea className="flex-1 w-full">
          <div className="px-1 py-2">
            {sessions.map((session) => (
              <Button
                key={session.id}
                variant={session.id === currentSessionId ? "default" : "ghost"}
                className="w-full justify-start my-1 p-2"
                onClick={() => handleSelectChat(session.id)}
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-sidebar text-sidebar-foreground w-80",
        className
      )}
    >
      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold">Chat History</h2>
        <Button 
          variant="outline"
          size="icon"
          onClick={onToggle}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      <Button
        className="mx-4 mb-4"
        onClick={handleNewChat}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        New Chat
      </Button>
      <ScrollArea className="flex-1">
        <div className="p-4 pt-0">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={cn(
                "group flex items-center justify-between rounded-md mb-1 text-sm",
                session.id === currentSessionId
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent/50"
              )}
            >
              {renamingId === session.id ? (
                <div className="flex items-center justify-between w-full p-2">
                  <Input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, session.id)}
                    autoFocus
                    className="h-8 flex-1 mr-2"
                  />
                  <div className="flex shrink-0">
                    <Button
                      variant="ghost" 
                      size="sm"
                      onClick={() => confirmRename(session.id)}
                      className="h-8 w-8 p-0 mr-1"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost" 
                      size="sm"
                      onClick={cancelRename}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="w-full justify-start truncate"
                    onClick={() => handleSelectChat(session.id)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2 shrink-0" />
                    <span className="truncate">{session.title}</span>
                  </Button>
                  <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => startRenaming(session.id, session.title)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => deleteSession(session.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
