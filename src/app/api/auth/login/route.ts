// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // 🔍 디버깅: 전체 요청 정보 확인
  console.log('🚀 Starting Spotify OAuth login...');
  console.log('🌐 Full URL:', request.nextUrl.toString());
  console.log('🔍 Request method:', request.method);
  console.log('🔍 Request headers:', Object.fromEntries(request.headers));
  console.log('🔍 Origin:', request.nextUrl.origin);

  // 🔍 Step 1: 환경변수 받아오기
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  
  console.log('🔑 Client ID:', clientId);
  console.log('🌍 App URL:', appUrl);

  // ✅ 환경변수 유효성 검사
  if (!clientId || !appUrl) {
    console.error('❌ Missing environment variables for login:');
    console.error('  - clientId:', clientId ? 'defined' : 'MISSING');
    console.error('  - appUrl:', appUrl ? 'defined' : 'MISSING');
    
    return NextResponse.json({ 
      error: 'Missing configuration',
      details: 'Required environment variables are not set' 
    }, { status: 500 });
  }

  console.log('✅ Environment variables validated successfully');

  // 🔍 Step 2: 올바른 redirect URI 생성
  const redirectUri = `${appUrl}/api/auth/callback`;
  console.log('🔁 Redirect URI:', redirectUri);

  // 🔍 Step 3: OAuth 파라미터 설정
  const scope = 'user-read-private user-read-email user-top-read user-read-recently-played';
  // state에 최종 목적지 정보 포함
  const state = JSON.stringify({
    random: Math.random().toString(36).substring(2, 15),
    redirectTo: '/dashboard' // 🎯 로그인 성공 후 리디렉션할 경로
  });
  
  console.log('🔐 Scope:', scope);
  console.log('🏷 State:', state);

  try {
    // 🔍 Step 4: Spotify OAuth URL 생성
    const spotifyAuthUrl = `https://accounts.spotify.com/authorize?` +
      `client_id=${encodeURIComponent(clientId)}&` +
      `response_type=code&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(scope)}&` +
      `state=${encodeURIComponent(state)}`;
    
    console.log('🔗 Spotify Auth URL:', spotifyAuthUrl);
    console.log('📤 OAuth parameters:');
    console.log('  - client_id:', clientId);
    console.log('  - response_type: code');
    console.log('  - redirect_uri:', redirectUri);
    console.log('  - scope:', scope);
    console.log('  - state:', state);
    
    // 🔍 Step 5: URL 파라미터 개별 검증
    const url = new URL(spotifyAuthUrl);
    console.log('🔍 Generated URL components:');
    console.log('  - Protocol:', url.protocol);
    console.log('  - Host:', url.host);
    console.log('  - Pathname:', url.pathname);
    console.log('  - Search params:', Object.fromEntries(url.searchParams));

    console.log('🔁 Redirecting to Spotify OAuth...');
    
    // Spotify OAuth 페이지로 리디렉션
    return NextResponse.redirect(spotifyAuthUrl);
    
  } catch (err) {
    console.error('❌ OAuth URL 생성 실패:', err);
    
    // 더 자세한 에러 정보 로깅
    if (err instanceof Error) {
      console.error('📝 Error message:', err.message);
      console.error('📚 Error stack:', err.stack);
    }
    
    return NextResponse.json({ 
      error: 'OAuth URL generation failed',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
}