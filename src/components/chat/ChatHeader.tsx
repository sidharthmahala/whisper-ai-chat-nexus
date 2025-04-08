
import { ModelSelector } from "./ModelSelector";
import { ThemeToggle } from "../ThemeToggle";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatHeaderProps {
  onSettingsClick: () => void;
  className?: string;
}

export function ChatHeader({ onSettingsClick, className }: ChatHeaderProps) {
  return (
    <header className={cn("border-b bg-background p-3", className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="w-60 hidden md:block">
          <ModelSelector />
        </div>
        <div className="flex-1 text-center sm:flex-0">
          <h1 className="text-xl font-semibold hidden md:block">AI Chat Nexus</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="block md:hidden">
            <ModelSelector />
          </div>
          <Button variant="outline" size="icon" onClick={onSettingsClick}>
            <Settings className="h-5 w-5" />
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
