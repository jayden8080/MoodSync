"use client";

import { createContext, useContext, useState, ReactNode, FC } from "react";
import { generatePlaylist } from "@/ai/flows/generate-playlist";
import { useToast } from "@/hooks/use-toast";

export interface Message {
  id: number;
  type: "user" | "ai";
  text: string | React.ReactNode;
}

interface AppContextType {
  messages: Message[];
  inputValue: string;
  isAiTyping: boolean;
  currentView: "home" | "chat";
  sendMessage: (messageText: string) => Promise<void>;
  setInputValue: (value: string) => void;
  setCurrentView: (view: "home" | "chat") => void;
  suggestMood: (mood: string) => void;

  addMessage: (type: "user" | "ai", text: string | React.ReactNode) => void; // 추가
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [currentView, setCurrentView] = useState<"home" | "chat">("home");
  const { toast } = useToast();

  const addMessage = (type: "user" | "ai", text: string | React.ReactNode) => {
    setMessages((prev) => [...prev, { id: Date.now(), type, text }]);
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    setCurrentView("chat");
    addMessage("user", messageText);
    setInputValue("");
    setIsAiTyping(true);

    try {
      const response = await generatePlaylist({ mood: messageText });
      const aiResponse = (
        <div>
          <p className="mb-2">{response.playlistDescription}</p>
          <ul className="list-disc pl-5 space-y-1">
            {response.songSuggestions.map((song, index) => (
              <li key={index}>{song}</li>
            ))}
          </ul>
        </div>
      );
      addMessage("ai", aiResponse);
    } catch (error) {
      console.error("Error generating playlist:", error);
      addMessage("ai", "Sorry, I had some trouble generating a playlist. Please try again.");
      toast({
        title: "Error",
        description: "Failed to generate playlist.",
        variant: "destructive",
      });
    } finally {
      setIsAiTyping(false);
    }
  };

  const suggestMood = (mood: string) => {
    const suggestions: { [key: string]: string } = {
      happy: "I'm feeling happy and want some upbeat music!",
      chill: "I want to relax with some chill music",
      focused: "I need music to help me focus while working",
      nostalgic: "I'm feeling nostalgic, play some throwback songs",
      energetic: "I need high-energy music for my workout",
      romantic: "I'm in a romantic mood, play some love songs",
    };
    setInputValue(suggestions[mood] || `Tell me about music for a ${mood} mood.`);
    const input = document.getElementById("chat-input");
    if (input) {
      input.focus();
    }
  };

  return (
    <AppContext.Provider
      value={{
        messages,
        inputValue,
        isAiTyping,
        currentView,
        sendMessage,
        setInputValue,
        setCurrentView,
        suggestMood,
        addMessage, // 추가
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
