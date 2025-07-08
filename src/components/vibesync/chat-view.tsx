"use client";

import { useApp } from '@/contexts/app-context';
import { ScrollArea } from '@/components/ui/primitives/scroll-area';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';
import { Message } from '@/contexts/app-context';

export default function ChatView() {
  const { messages, isAiTyping } = useApp();
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages, isAiTyping]);

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto">
        <ScrollArea className="flex-1 -mx-4" viewportRef={viewportRef}>
            <div className="px-4 py-2 space-y-6">
                {messages.map((message: Message) => (
                <div
                    key={message.id}
                    className={cn(
                    'p-4 rounded-lg max-w-[85%] sm:max-w-[75%]',
                    {
                      'bg-primary text-primary-foreground ml-auto': message.type === 'user',
                      'bg-[#2a2a2a] text-white mr-auto': message.type !== 'user',
                    }
                    )}
                >
                    {typeof message.text === 'string' ? <p>{message.text}</p> : message.text}
                </div>
                ))}
            </div>
        </ScrollArea>
        {isAiTyping && (
            <div className="text-muted-foreground italic mt-4 animate-pulse" role="status" aria-live="polite">
                AI is thinking...
            </div>
        )}
    </div>
  );
}
