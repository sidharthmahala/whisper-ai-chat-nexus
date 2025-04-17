
import { Button } from "@/components/ui/button";
import { ModelSelector } from "./ModelSelector";
import { Settings, User } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";

interface ChatHeaderProps {
  onSettingsClick?: () => void;
}

export function ChatHeader({ 
  onSettingsClick
}: ChatHeaderProps) {
  const navigate = useNavigate();
  
  const handleSettingsClick = () => {
    // Navigate to profile settings page
    navigate("/profile");
  };
  
  return (
    <header className="border-b px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Left margin to account for the fixed toggle button */}
        <div className="w-10"></div>
        <h1 className="text-xl font-bold hidden md:block">AI Chat Nexus</h1>
        <div className="w-40 md:w-60">
          <ModelSelector />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleSettingsClick}
          title="Profile Settings"
        >
          <User className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onSettingsClick}
          title="Chat Settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
