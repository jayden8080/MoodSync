import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('🔄 Processing Spotify OAuth callback...');

  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    console.error('❌ OAuth Error:', error);
    return NextResponse.redirect(new URL('/login?error=oauth_error', process.env.NEXT_PUBLIC_APP_URL));
  }

  if (!code || !state) {
    console.error('❌ Missing "code" or "state" in callback URL');
    return NextResponse.redirect(new URL('/login?error=missing_params', process.env.NEXT_PUBLIC_APP_URL));
  }

  let stateData;
  try {
    stateData = JSON.parse(decodeURIComponent(state));
  } catch (err) {
    console.error('❌ Invalid state format:', err);
    return NextResponse.redirect(new URL('/login?error=invalid_state', process.env.NEXT_PUBLIC_APP_URL));
  }

  const redirectTo = stateData.redirectTo || '/';
  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
  const redirectUri = `${appUrl}/api/auth/callback`;

  try {
    // 🔐 1. Access Token 요청
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('❌ Failed to fetch access token:', errorText);
      throw new Error('Token exchange failed');
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token, expires_in, scope } = tokenData;

    if (!access_token) {
      console.error('❌ Access token is missing');
      throw new Error('Access token not returned');
    }

    const grantedScopes = (scope ?? '').split(' ');
    console.log('🔐 Granted Scopes:', grantedScopes.join(', '));

    // (선택) 필요 권한 비교
    const requiredScopes = [
      'user-read-private',
      'user-read-email',
      'user-top-read',
      'user-read-recently-played',
      'playlist-modify-public',
    ];
    const missingScopes = requiredScopes.filter(s => !grantedScopes.includes(s));
    if (missingScopes.length > 0) {
      console.warn('⚠️ Missing required scopes:', missingScopes);
    }

    // 👤 2. 사용자 정보 요청
    const userResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.error('❌ Failed to fetch user info:', errorText);
      throw new Error('User info fetch failed');
    }

    const userData = await userResponse.json();
    console.log(`✅ Logged in as: ${userData.display_name} (${userData.email})`);

    // 🍪 3. 쿠키 설정
    const response = NextResponse.redirect(new URL(`${redirectTo}?login=success`, appUrl));
    const maxAgeAccessToken = expires_in ?? 3600;

    response.cookies.set('spotify_access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: maxAgeAccessToken,
      path: '/',
    });

    if (refresh_token) {
      response.cookies.set('spotify_refresh_token', refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30일
        path: '/',
      });
    }

    response.cookies.set(
      'user_info',
      JSON.stringify({
        id: userData.id,
        display_name: userData.display_name,
        email: userData.email,
        country: userData.country,
        image: userData.images?.[0]?.url,
        product: userData.product,
        followers: userData.followers?.total || 0,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60, // 1일
        path: '/',
      }
    );

    return response;
  } catch (err) {
    console.error('❌ OAuth callback failed:', err);
    return NextResponse.redirect(new URL('/login?error=callback_failed', appUrl));
  }
}
