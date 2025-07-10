'use client';

import { useState, useEffect } from 'react';
import type React from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sidebar, SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Home, History, ListMusic, Heart, PlayCircle, Compass, Radio, Mic2, Search, Zap, Target, Hourglass, Loader2, ServerCrash } from "lucide-react";
import { Logo } from "@/components/icons/logo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { suggestSongsFromMood, SuggestSongsFromMoodOutput } from '@/ai/flows/suggest-songs-from-mood';
import { useToast } from '@/hooks/use-toast';
import { PlaylistDisplay } from '@/components/playlist-display';
import { Skeleton } from '@/components/ui/skeleton';

// Spotify 사용자 정보 인터페이스
interface SpotifyUser {
  id: string;
  name: string;
  email: string;
  country: string;
  followers: number;
  images: Array<{ url: string; height: number; width: number }>;
  product: string;
}

type MoodCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
};

function MoodCard({ icon, title, description, onClick }: MoodCardProps) {
  return (
    <Card className="cursor-pointer hover:bg-card/80 transition-colors" onClick={onClick}>
      <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2 h-full">
        <div className="text-4xl mb-2">{icon}</div>
        <h3 className="font-bold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

const moods = [
    { title: '행복', description: '경쾌하고 에너지 넘치는 트랙', icon: <span className="text-4xl">😊</span> },
    { title: '휴식', description: '편안하고 부드러운 분위기', icon: <span className="text-4xl">😌</span> },
    { title: '집중', description: '일과 공부에 적합', icon: <Target className="w-10 h-10" /> },
    { title: '추억', description: '추억의 명곡들', icon: <Hourglass className="w-10 h-10" /> },
    { title: '활력', description: '에너제틱한 운동 음악', icon: <Zap className="w-10 h-10" /> },
    { title: '로맨틱', description: '사랑 노래와 발라드', icon: <Heart className="w-10 h-10" /> },
];

function DashboardContent({
  suggestions,
  isLoading,
  error,
  onMoodSelect,
}: {
  suggestions: SuggestSongsFromMoodOutput | null;
  isLoading: boolean;
  error: string | null;
  onMoodSelect: (mood: string) => void;
}) {
  const renderContent = () => {
    if (isLoading) {
      return (
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-1/2 rounded-md" />
            <Skeleton className="h-4 w-3/4 rounded-md" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      );
    }
    if (error) {
      return (
        <Card className="border-destructive">
          <CardHeader className="flex-row items-center gap-4">
            <ServerCrash className="h-8 w-8 text-destructive" />
            <div>
              <CardTitle className="font-headline text-destructive">생성 실패</CardTitle>
              <CardDescription className="text-destructive/80">{error}</CardDescription>
            </div>
          </CardHeader>
        </Card>
      );
    }
    if (suggestions) {
      return <PlaylistDisplay songs={suggestions.suggestedSongs} />;
    }
    return (
        <div className="space-y-8">
        <div className="text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              MoodSync에 오신 것을 환영합니다
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              기분이 어떤지 알려주시면 완벽한 음악을 찾아드릴게요
            </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {moods.map((mood) => (
            <MoodCard
                key={mood.title}
                title={mood.title}
                description={mood.description}
                icon={mood.icon}
                onClick={() => onMoodSelect(mood.title)}
            />
            ))}
        </div>
        </div>
    );
  };

  return <div className="mt-8">{renderContent()}</div>;
}

function UserNav({ user }: { user: SpotifyUser }) {
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={user.images?.[0]?.url || '/avatar-placeholder.png'} 
              alt={user.name} 
              data-ai-hint="user avatar" 
            />
            <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// 로그인 성공 알림 컴포넌트
function LoginSuccessNotification() {
  return (
    <Card className="border-green-200 bg-green-50 mb-6">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="font-semibold text-green-800">Spotify 로그인 성공!</p>
            <p className="text-sm text-green-700">이제 개인화된 음악 추천을 받을 수 있습니다.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [suggestions, setSuggestions] = useState<SuggestSongsFromMoodOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);

  useEffect(() => {
    // URL 파라미터에서 로그인 성공 여부 확인
    const urlParams = new URLSearchParams(window.location.search);
    const loginParam = urlParams.get('login');
    
    if (loginParam === 'success') {
      setShowLoginSuccess(true);
      // URL에서 파라미터 제거
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      
      // 3초 후 알림 숨기기
      setTimeout(() => {
        setShowLoginSuccess(false);
      }, 5000);
    }
  }, []);

  useEffect(() => {
    async function fetchUser() {
      try {
        console.log('🔍 Fetching user info...');
        const res = await fetch('/api/user');
        
        if (res.ok) {
          const data = await res.json();
          console.log('✅ User data received:', data);
          setUser(data.user);
        } else if (res.status === 401) {
          console.log('❌ User not authenticated, redirecting to login');
          window.location.href = '/api/auth/login';
        } else {
          console.error('❌ Failed to fetch user:', res.status);
          window.location.href = '/';
        }
      } catch (error) {
        console.error('❌ Error fetching user:', error);
        window.location.href = '/';
      } finally {
        setIsAuthLoading(false);
      }
    }
    
    fetchUser();
  }, []);

  async function handleMoodSelect(mood: string) {
    if (!mood.trim()) return;
    setIsLoading(true);
    setSuggestions(null);
    setError(null);

    try {
      const result = await suggestSongsFromMood({ moodDescription: mood });
      if (result && result.suggestedSongs && result.suggestedSongs.length > 0) {
        setSuggestions(result);
      } else {
        setError('노래 추천을 생성할 수 없습니다. 다른 기분을 시도해 보세요.');
      }
    } catch (e) {
      console.error(e);
      setError('예상치 못한 오류가 발생했습니다. 나중에 다시 시도해 주세요.');
      toast({
        variant: 'destructive',
        title: '이런! 문제가 발생했습니다.',
        description: 'AI 추천 서비스에 문제가 발생했습니다.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleMoodSelect(searchTerm);
    setSearchTerm('');
  }

  // 로딩 상태
  if (isAuthLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Spotify 계정을 확인하는 중...</p>
        </div>
      </div>
    );
  }

  // 사용자 정보가 없는 경우
  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">리디렉션 중...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <div className="p-4">
          <div className="flex items-center gap-2">
            <Logo className="h-6 w-6 text-primary" />
            <h1 className="font-headline text-lg font-semibold text-foreground">
              MoodSync
            </h1>
          </div>
        </div>
        <SidebarContent className="p-4 pt-0">
          <SidebarGroup>
            <h2 className="mb-2 text-xs font-bold uppercase text-sidebar-foreground/70 tracking-widest">내 라이브러리</h2>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive>
                  <Home />
                  <span>홈</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <History />
                  <span>히스토리</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <ListMusic />
                  <span>내 플레이리스트</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Heart />
                  <span>좋아요 표시한 곡</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup>
            <h2 className="mb-2 text-xs font-bold uppercase text-sidebar-foreground/70 tracking-widest">최근 재생</h2>
            <SidebarMenu>
              <SidebarMenuItem><SidebarMenuButton><PlayCircle /><span>편안한 분위기</span></SidebarMenuButton></SidebarMenuItem>
              <SidebarMenuItem><SidebarMenuButton><PlayCircle /><span>록 클래식</span></SidebarMenuButton></SidebarMenuItem>
              <SidebarMenuItem><SidebarMenuButton><PlayCircle /><span>재즈 필수곡</span></SidebarMenuButton></SidebarMenuItem>
              <SidebarMenuItem><SidebarMenuButton><PlayCircle /><span>팝 히트곡</span></SidebarMenuButton></SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup>
            <h2 className="mb-2 text-xs font-bold uppercase text-sidebar-foreground/70 tracking-widest">맞춤 추천</h2>
            <SidebarMenu>
              <SidebarMenuItem><SidebarMenuButton><Compass /><span>디스커버 위클리</span></SidebarMenuButton></SidebarMenuItem>
              <SidebarMenuItem><SidebarMenuButton><Radio /><span>릴리즈 레이더</span></SidebarMenuButton></SidebarMenuItem>
              <SidebarMenuItem><SidebarMenuButton><ListMusic /><span>데일리 믹스 1</span></SidebarMenuButton></SidebarMenuItem>
              <SidebarMenuItem><SidebarMenuButton><Mic2 /><span>Mood Sync 믹스</span></SidebarMenuButton></SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
          <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex-1">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="오늘 기분이 어떠세요?" 
                    className="pl-9 bg-card focus-visible:ring-primary"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </form>
            </div>
            <div className="flex items-center gap-3">
              <UserNav user={user} />
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* 로그인 성공 알림 */}
          {showLoginSuccess && <LoginSuccessNotification />}
          
          <DashboardContent
            suggestions={suggestions}
            isLoading={isLoading}
            error={error}
            onMoodSelect={handleMoodSelect}
           />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}