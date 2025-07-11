// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('🚀 Starting Spotify OAuth login...');
  console.log('🌐 Full URL:', request.nextUrl.toString());

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!clientId || !appUrl) {
    console.error('❌ Missing required environment variables: SPOTIFY_CLIENT_ID or NEXT_PUBLIC_APP_URL');
    return NextResponse.json(
      {
        error: 'Missing configuration',
        details: 'SPOTIFY_CLIENT_ID or NEXT_PUBLIC_APP_URL is not set in the environment.',
      },
      { status: 500 }
    );
  }

  const redirectUri = `${appUrl}/api/auth/callback`;
  console.log('🔁 Redirect URI:', redirectUri);

  const scopes = [
    'ugc-image-upload',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'app-remote-control',
    'streaming',
    'user-read-email',
    'user-read-private',
    'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-private',
    'playlist-modify-public',
    'user-follow-read',
    'user-follow-modify',
    'user-library-read',
    'user-library-modify',
    'user-top-read',
    'user-read-recently-played',
    'user-read-playback-position',
  ];
  const scope = scopes.join(' ');

  const stateObj = {
    random: Math.random().toString(36).substring(2, 15),
    redirectTo: '/dashboard',
  };
  const state = encodeURIComponent(JSON.stringify(stateObj));

  console.log('🔐 Scope:', scope);
  console.log('🏷 State (decoded):', JSON.stringify(stateObj));

  try {
    const spotifyAuthUrl = new URL('https://accounts.spotify.com/authorize');
    spotifyAuthUrl.searchParams.set('client_id', clientId);
    spotifyAuthUrl.searchParams.set('response_type', 'code');
    spotifyAuthUrl.searchParams.set('redirect_uri', redirectUri);
    spotifyAuthUrl.searchParams.set('scope', scope);
    spotifyAuthUrl.searchParams.set('state', state);
    spotifyAuthUrl.searchParams.set('show_dialog', 'true'); // ✅ 강제 동의창

    console.log('🔗 Spotify Auth URL:', spotifyAuthUrl.toString());

    return NextResponse.redirect(spotifyAuthUrl.toString());
  } catch (err) {
    console.error('❌ Failed to generate Spotify OAuth URL:', err);
    return NextResponse.json(
      {
        error: 'OAuth URL generation failed',
        details: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
