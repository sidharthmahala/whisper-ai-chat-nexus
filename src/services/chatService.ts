
import { aiModels } from "@/data/models";
import { ChatMessage, ChatSettings } from "@/types/chat";

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock responses based on model
const generateMockResponse = (message: string, modelId: string): string => {
  const model = aiModels.find(m => m.id === modelId) || aiModels[0];
  const responsePrefix = `As ${model.name} by ${model.provider}, `;
  
  if (message.toLowerCase().includes("hello") || message.toLowerCase().includes("hi")) {
    return `${responsePrefix}I'm happy to assist you today! How can I help you with your tasks?`;
  }
  
  if (message.toLowerCase().includes("who are you")) {
    return `${responsePrefix}I'm an AI assistant designed to be helpful, harmless, and honest. My strengths include ${model.strengths.join(", ")}. I'm commonly used for ${model.useCases.slice(0, 2).join(", ")}, and other tasks.`;
  }
  
  if (message.toLowerCase().includes("how do i")) {
    return `${responsePrefix}I'd be happy to help with your question. To provide the best guidance, could you please provide more specific details about what you're trying to accomplish?`;
  }

  if (message.toLowerCase().includes("code") || message.toLowerCase().includes("function")) {
    return `${responsePrefix}Here's a simple example of how you might approach this with code:

\`\`\`javascript
function processData(input) {
  // Parse the input
  const data = JSON.parse(input);
  
  // Transform the data
  const result = data.map(item => ({
    id: item.id,
    name: item.name,
    value: item.value * 2
  }));
  
  return result;
}
\`\`\`

Would you like me to explain how this code works or adjust it to better fit your specific needs?`;
  }
  
  return `${responsePrefix}Thank you for your message. I'm processing your request and will do my best to provide a helpful response. Could you provide more details so I can give you a more specific answer?`;
};

// Mock API service
export const chatService = {
  async sendMessage(message: string, history: ChatMessage[], modelId: string, settings: ChatSettings): Promise<string> {
    console.log("Sending message:", message);
    console.log("Using model:", modelId);
    console.log("With settings:", settings);
    
    // Simulate network delay (300-2000ms)
    await delay(Math.random() * 1700 + 300);
    
    // 5% chance of simulating an error
    if (Math.random() < 0.05) {
      throw new Error("Failed to get response from the AI model. Please try again.");
    }
    
    return generateMockResponse(message, modelId);
  }
};
