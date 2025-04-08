
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ArrowLeft, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useChatStore } from "@/store/chatStore";
import { toast } from "@/components/ui/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useChatStore();
  
  const [systemPrompt, setSystemPrompt] = useState(settings.systemPrompt);
  const [temperature, setTemperature] = useState(settings.temperature);
  const [maxTokens, setMaxTokens] = useState(settings.maxTokens);
  
  const handleSave = () => {
    updateSettings({
      systemPrompt,
      temperature,
      maxTokens
    });
    
    toast({
      title: "Settings saved",
      description: "Your profile and chat settings have been updated.",
    });
  };
  
  return (
    <ThemeProvider defaultTheme="system">
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Profile Settings</h1>
          </div>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </header>
        
        <main className="container max-w-4xl py-8 px-4">
          <Tabs defaultValue="profile">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="chat">Chat Preferences</TabsTrigger>
              <TabsTrigger value="api">API Keys</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>User Profile</CardTitle>
                  <CardDescription>
                    Manage your personal information and preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Display Name</Label>
                    <Input id="name" placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="your.email@example.com" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="chat">
              <Card>
                <CardHeader>
                  <CardTitle>Chat Preferences</CardTitle>
                  <CardDescription>
                    Configure how the AI models interact with you.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="system-prompt">Default System Prompt</Label>
                    <Textarea 
                      id="system-prompt" 
                      placeholder="You are a helpful AI assistant."
                      value={systemPrompt}
                      onChange={(e) => setSystemPrompt(e.target.value)}
                      rows={4}
                    />
                    <p className="text-sm text-muted-foreground">
                      This message sets the behavior of the AI in all your chats.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="temperature">Temperature: {temperature.toFixed(1)}</Label>
                      </div>
                      <Slider 
                        id="temperature"
                        min={0}
                        max={2}
                        step={0.1}
                        value={[temperature]} 
                        onValueChange={(values) => setTemperature(values[0])}
                      />
                      <p className="text-sm text-muted-foreground">
                        Lower values make responses more focused and deterministic. Higher values make responses more random and creative.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="max-tokens">Max Tokens: {maxTokens}</Label>
                      </div>
                      <Slider 
                        id="max-tokens"
                        min={100}
                        max={4000}
                        step={100}
                        value={[maxTokens]} 
                        onValueChange={(values) => setMaxTokens(values[0])}
                      />
                      <p className="text-sm text-muted-foreground">
                        The maximum number of tokens to generate in the response.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSave}>Save Preferences</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="api">
              <Card>
                <CardHeader>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>
                    Connect your own API keys for different AI providers.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="openai-key">OpenAI API Key</Label>
                    <Input id="openai-key" type="password" placeholder="sk-..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="anthropic-key">Anthropic API Key</Label>
                    <Input id="anthropic-key" type="password" placeholder="sk-ant-..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="google-key">Google AI API Key</Label>
                    <Input id="google-key" type="password" placeholder="..." />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSave}>Save Keys</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Profile;
