
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { aiModels, AIModel } from "@/data/models";
import { useChatStore } from "@/store/chatStore";
import { 
  Brain, 
  Sparkles, 
  Zap, 
  BookOpen, 
  Diamond, 
  Wind, 
  Bot 
} from "lucide-react";

const getModelIcon = (iconName: string) => {
  switch(iconName) {
    case 'sparkles': return <Sparkles className="mr-2 h-4 w-4" />;
    case 'zap': return <Zap className="mr-2 h-4 w-4" />;
    case 'brain': return <Brain className="mr-2 h-4 w-4" />;
    case 'book-open': return <BookOpen className="mr-2 h-4 w-4" />;
    case 'diamond': return <Diamond className="mr-2 h-4 w-4" />;
    case 'wind': return <Wind className="mr-2 h-4 w-4" />;
    default: return <Bot className="mr-2 h-4 w-4" />;
  }
};

export function ModelSelector() {
  const [open, setOpen] = useState(false);
  const currentSession = useChatStore((state) => state.getCurrentSession());
  const createSession = useChatStore((state) => state.createSession);
  const setModelForCurrentSession = useChatStore((state) => state.setModelForCurrentSession);
  
  const currentModel = aiModels.find(
    (model) => model.id === (currentSession?.modelId || aiModels[0].id)
  ) || aiModels[0];

  const handleSelectModel = (model: AIModel) => {
    // Check if current session has messages
    const hasMessages = currentSession && currentSession.messages.length > 0;

    if (hasMessages) {
      // Create a new session with selected model only if there are messages
      const newSessionId = createSession();
      // Set the model for the newly created session
      setModelForCurrentSession(model.id);
    } else {
      // Just update the current session's model if there are no messages
      setModelForCurrentSession(model.id);
    }
    
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex items-center">
            {getModelIcon(currentModel.icon)}
            <span className="ml-1">{currentModel.name}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search models..." />
          <CommandEmpty>No model found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {aiModels.map((model) => (
                <CommandItem
                  key={model.id}
                  value={`${model.name}-${model.provider}`}
                  onSelect={() => handleSelectModel(model)}
                >
                  <div className="flex items-center">
                    {getModelIcon(model.icon)}
                    <span>{model.name}</span>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentModel.id === model.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
