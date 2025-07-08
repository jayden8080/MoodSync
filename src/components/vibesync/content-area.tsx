"use client";

import { useApp } from '@/contexts/app-context';
import WelcomeScreen from './welcome-screen';
import ChatView from './chat-view';

export default function ContentArea() {
  const { currentView } = useApp();

  return (
    <main className="flex-1 bg-background p-5 sm:p-8 overflow-y-auto">
      {currentView === 'home' ? <WelcomeScreen /> : <ChatView />}
    </main>
  );
}
