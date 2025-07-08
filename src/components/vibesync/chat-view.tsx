'use client';

import { useApp } from '@/contexts/app-context';
import { ScrollArea } from '@/components/ui/primitives/scroll-area';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

const SpotifyPlaylistEmbed = ({ playlistId }: { playlistId: string }) => {
  const url = `https://open.spotify.com/embed/playlist/${playlistId}`;
  return (
    <iframe
      title="Spotify Embed: Recommendation Playlist"
      src={url}
      width="100%"
      height="380"
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    />
  );
};

export default function ChatView() {
  const { messages, isAiTyping, addMessage } = useApp();

  const viewportRef = useRef<HTMLDivElement>(null);
  const [playlistId, setPlaylistId] = useState<string | null>(null);
  // lastUserMessageId 타입을 string으로 고정 (null 포함)
  const [lastUserMessageId, setLastUserMessageId] = useState<string | null>(null);

  // 스크롤 자동 이동 (부드럽게)
  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isAiTyping]);

  useEffect(() => {
    if (!messages.length) return;

    const lastMessage = messages[messages.length - 1];
    if (lastMessage.type !== 'user') return;

    // lastMessage.id가 number일 수도 있으니 string으로 변환
    const lastMessageIdStr = String(lastMessage.id);

    // 중복 호출 방지
    if (lastUserMessageId === lastMessageIdStr) return;

    setLastUserMessageId(lastMessageIdStr);

    fetch('/api/generatePlaylist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood: lastMessage.text }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          console.error('서버 오류:', data.error);
          return;
        }

        setPlaylistId(data.playlistId);

        if (typeof addMessage === 'function') {
          const messageText =
            `${data.playlistDescription}\n\n` +
            data.songSuggestions.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n');

          addMessage('ai', {
            id: `ai-${Date.now()}`,
            type: 'ai',
            text: messageText,
          });
        }
      })
      .catch(err => {
        console.error('플레이리스트 생성 실패:', err);
      });
  }, [messages, addMessage, lastUserMessageId]);

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto">
      <ScrollArea className="flex-1 -mx-4" viewportRef={viewportRef}>
        <div className="px-4 py-2 space-y-6">
          {messages.map((message) => (
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
              <pre className="whitespace-pre-wrap">{message.text}</pre>
            </div>
          ))}

          {playlistId && <SpotifyPlaylistEmbed playlistId={playlistId} />}
        </div>
      </ScrollArea>

      {isAiTyping && (
        <div
          className="text-muted-foreground italic mt-4 animate-pulse"
          role="status"
          aria-live="polite"
        >
          AI is thinking...
        </div>
      )}
    </div>
  );
}
