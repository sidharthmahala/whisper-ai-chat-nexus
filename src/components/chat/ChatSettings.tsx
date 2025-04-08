
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useChatStore } from "@/store/chatStore";
import { Button } from "@/components/ui/button";

interface ChatSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatSettings({ open, onOpenChange }: ChatSettingsProps) {
  const settings = useChatStore(state => state.settings);
  const updateSettings = useChatStore(state => state.updateSettings);
  
  const [systemPrompt, setSystemPrompt] = useState(settings.systemPrompt);
  const [temperature, setTemperature] = useState(settings.temperature);
  const [maxTokens, setMaxTokens] = useState(settings.maxTokens);
  
  useEffect(() => {
    if (open) {
      setSystemPrompt(settings.systemPrompt);
      setTemperature(settings.temperature);
      setMaxTokens(settings.maxTokens);
    }
  }, [open, settings]);
  
  const handleSave = () => {
    updateSettings({
      systemPrompt,
      temperature,
      maxTokens
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chat Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="system-prompt">System Prompt</Label>
            <Textarea 
              id="system-prompt" 
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="You are a helpful AI assistant."
              className="min-h-[100px]"
            />
            <p className="text-sm text-muted-foreground">
              This prompt sets the behavior and context for the AI model.
            </p>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="temperature">Temperature: {temperature.toFixed(1)}</Label>
            <Slider
              id="temperature"
              min={0}
              max={2}
              step={0.1}
              value={[temperature]}
              onValueChange={(value) => setTemperature(value[0])}
            />
            <p className="text-sm text-muted-foreground">
              Controls randomness: Lower values are more focused, higher values more creative.
            </p>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="max-tokens">Max Tokens</Label>
            <Input
              id="max-tokens"
              type="number"
              value={maxTokens}
              onChange={(e) => setMaxTokens(Number(e.target.value))}
              min={100}
              max={8000}
            />
            <p className="text-sm text-muted-foreground">
              Maximum length of the model's response.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
