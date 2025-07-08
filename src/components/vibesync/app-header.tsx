"use client";

import { useApp } from '@/contexts/app-context';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Music } from 'lucide-react';

export default function AppHeader() {
  const { inputValue, setInputValue, sendMessage } = useApp();

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      sendMessage(inputValue);
    }
  };

  return (
    <header className="bg-[#000000] px-6 py-3 flex items-center justify-between border-b border-white/10 shrink-0">
      <div className="font-headline text-2xl font-bold text-primary flex items-center gap-2">
        <Music />
        VibeSync
      </div>
      <div className="flex-1 max-w-xl mx-10">
        <Input
          id="chat-input"
          type="text"
          placeholder="What would you like to listen to right now?"
          className="bg-[#2a2a2a] border-[#404040] rounded-full px-5 py-3 h-12 focus:border-primary focus:bg-[#333333] transition-all"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>
      <div className="flex items-center gap-3 cursor-pointer">
        <Avatar>
          <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" data-ai-hint="avatar profile" />
          <AvatarFallback>ML</AvatarFallback>
        </Avatar>
        <span className="font-medium">Music Lover</span>
      </div>
    </header>
  );
}
