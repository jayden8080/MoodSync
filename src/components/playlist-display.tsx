import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SongCard } from "./song-card";
import { ListMusic, PlusCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createPlaylistOnSpotify } from "@/app/actions/create-playlist";
import { ToastAction } from "./ui/toast";

type PlaylistDisplayProps = {
  songs: string[];
};

export function PlaylistDisplay({ songs }: PlaylistDisplayProps) {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const handleCreatePlaylist = async () => {
    setIsCreating(true);
    const result = await createPlaylistOnSpotify(songs);
    setIsCreating(false);

    if (result.playlistUrl) {
      toast({
        title: '플레이리스트 생성 완료!',
        description: '새 플레이리스트가 Spotify에 준비되었습니다.',
        action: (
          <ToastAction altText="플레이리스트 열기" asChild>
            <a href={result.playlistUrl} target="_blank" rel="noopener noreferrer">
              열기
            </a>
          </ToastAction>
        ),
      });
    } else {
      toast({
        variant: 'destructive',
        title: '플레이리스트 생성 실패',
        description: result.error || '알 수 없는 오류가 발생했습니다.',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <ListMusic className="h-6 w-6 text-primary" />
            당신만을 위한 분위기
        </CardTitle>
        <CardDescription>당신이 좋아할 만한 트랙들입니다. 새 플레이리스트나 라이브러리에 추가하세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {songs.map((song, index) => (
            <SongCard key={index} title={song} />
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex-col sm:flex-row gap-2">
        <Button onClick={handleCreatePlaylist} disabled={isCreating} className="w-full sm:w-auto">
          {isCreating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <PlusCircle className="mr-2 h-4 w-4" />
          )}
          {isCreating ? '생성 중...' : 'Spotify에 플레이리스트 만들기'}
        </Button>
      </CardFooter>
    </Card>
  );
}
