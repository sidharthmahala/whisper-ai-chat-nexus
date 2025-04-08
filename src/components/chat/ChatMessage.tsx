
import { ChatMessage as ChatMessageType } from "@/types/chat";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { User, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex items-start gap-4 p-4 animate-fade-in",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 shrink-0 bg-chat-ai flex items-center justify-center">
          <Bot className="h-5 w-5 text-chat-ai-foreground" />
        </Avatar>
      )}
      
      <div
        className={cn(
          "rounded-lg px-4 py-2 max-w-[85%] md:max-w-[65%]",
          isUser
            ? "bg-chat-user text-chat-user-foreground rounded-tr-none"
            : "bg-chat-ai text-chat-ai-foreground rounded-tl-none"
        )}
      >
        <div className="markdown-content">
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    language={match[1]}
                    style={dracula}
                    PreTag="div"
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className={cn("bg-muted px-1 py-0.5 rounded", className)} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
      
      {isUser && (
        <Avatar className="h-8 w-8 shrink-0 bg-chat-user flex items-center justify-center">
          <User className="h-5 w-5 text-chat-user-foreground" />
        </Avatar>
      )}
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-4 p-4">
      <Avatar className="h-8 w-8 shrink-0 bg-chat-ai flex items-center justify-center">
        <Bot className="h-5 w-5 text-chat-ai-foreground" />
      </Avatar>
      
      <div className="rounded-lg px-4 py-3 bg-chat-ai text-chat-ai-foreground rounded-tl-none">
        <div className="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}
