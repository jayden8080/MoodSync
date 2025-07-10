'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons/logo';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

function ErrorDisplay() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  if (!error) {
    return null;
  }

  let title: string;
  let description: React.ReactNode;

  switch (error) {
    case 'missing_env_vars':
      title = '서버 설정이 완료되지 않았습니다';
      description = (
        <>
          앱이 작동하는 데 필요한 API 키 또는 주소 설정이 누락되었습니다. 프로젝트 루트의{' '}
          <code>.env</code> 파일에 <code>SPOTIFY_CLIENT_ID</code>,{' '}
          <code>SPOTIFY_CLIENT_SECRET</code>, <code>SESSION_SECRET</code>, <code>OPENAI_API_KEY</code>, 그리고 <code>NEXT_PUBLIC_APP_URL</code>이 올바르게 설정되었는지 확인해주세요.
        </>
      );
      break;
    case 'AuthFailed':
      title = 'Spotify 인증 실패';
      description = `Spotify에서 인증 오류가 발생했습니다: ${
        searchParams.get('error_description') || '다시 로그인해주세요.'
      }`;
      break;
    case 'NoCode':
      title = 'Spotify 인증 오류';
      description = 'Spotify에서 인증 코드를 받지 못했습니다. 다시 시도해주세요.';
      break;
    default:
      title = '알 수 없는 오류';
      description = '알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      break;
  }

  return (
    <Alert variant="destructive" className="w-full max-w-md">
      <Terminal className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}


export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background p-4 gap-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <ErrorDisplay />
        <div className="flex justify-center pt-4">
          <Logo className="h-16 w-16 text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            MoodSync에 오신 것을 환영합니다
          </h1>
          <p className="text-lg text-muted-foreground">
            당신의 분위기에 꼭 맞는 음악을 찾아보세요.
          </p>
        </div>
        <div className="flex flex-col items-center space-y-4">
          <Link href="/api/auth/login" className="w-full max-w-xs">
            <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
               <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-5 w-5"
              >
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
              Spotify로 로그인
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground">
            허락 없이는 아무것도 게시하지 않습니다.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          AI 기반. 음악 애호가를 위해 제작되었습니다.
        </p>
      </div>
    </div>
  );
}
