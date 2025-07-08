"use client";

import { useState } from 'react';
import LoginScreen from '@/components/vibesync/login-screen';
import MainApp from '@/components/vibesync/main-app';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <main className="min-h-screen">
      {isLoggedIn ? <MainApp /> : <LoginScreen onLogin={handleLogin} />}
    </main>
  );
}
