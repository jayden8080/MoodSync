"use client";

import { AppProvider } from '@/contexts/app-context';
import AppSidebar from './app-sidebar';
import AppHeader from './app-header';
import ContentArea from './content-area';

export default function MainApp() {
  return (
    <AppProvider>
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <AppHeader />
          <ContentArea />
        </div>
      </div>
    </AppProvider>
  );
}
