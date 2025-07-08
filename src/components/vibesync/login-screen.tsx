"use client";

import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Music } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-primary to-[#191414]">
      <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-10 sm:p-16 rounded-2xl text-center max-w-md w-11/12 shadow-2xl">
        <h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary mb-2 flex items-center justify-center gap-3">
            <Music className="w-10 h-10" />
            VibeSync
        </h1>
        <p className="text-muted-foreground mb-10">AI-powered music discovery</p>
        <Button 
          onClick={onLogin} 
          className="w-full h-14 text-lg font-bold rounded-full bg-primary hover:bg-green-500 transition-all duration-300 transform hover:-translate-y-1"
          size="lg"
        >
          <Music className="w-6 h-6" />
          Connect with Spotify
        </Button>
      </div>
    </div>
  );
};

export default LoginScreen;
