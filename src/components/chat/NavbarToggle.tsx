
import { Button } from "@/components/ui/button";
import { PanelLeft, PanelRightOpen } from "lucide-react";

interface NavbarToggleProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function NavbarToggle({ isCollapsed, onToggle }: NavbarToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      title={isCollapsed ? "Show sidebar" : "Hide sidebar"}
      className="h-9 w-9"
    >
      {isCollapsed ? (
        <PanelRightOpen className="h-5 w-5" />
      ) : (
        <PanelLeft className="h-5 w-5" />
      )}
    </Button>
  );
}
