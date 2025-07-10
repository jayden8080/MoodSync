// app/api/user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  console.log('🔍 Checking user authentication...');

  // ⛏️ 쿠키는 await 필요
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('spotify_access_token');
  const userInfo = cookieStore.get('user_info');

  if (!accessToken) {
    console.log('❌ No access token found');
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    if (userInfo) {
      const user = JSON.parse(userInfo.value);
      console.log('✅ User info from cookie:', user.display_name);

      return NextResponse.json({
        user: {
          id: user.id,
          name: user.display_name,
          email: user.email,
          country: user.country || 'Unknown',
          followers: user.followers || 0,
          images: user.image ? [{ url: user.image, height: 300, width: 300 }] : [],
          product: user.product || 'free',
        },
      });
    }

    console.log('🔍 Fetching user info from Spotify API...');
    const userResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
    });

    if (!userResponse.ok) {
      console.error('❌ Failed to fetch user from Spotify:', userResponse.status);
      return NextResponse.json({ error: 'Failed to fetch user' }, { status: 401 });
    }

    const userData = await userResponse.json();
    console.log('✅ User data fetched from Spotify:', userData.display_name);

    const response = NextResponse.json({
      user: {
        id: userData.id,
        name: userData.display_name,
        email: userData.email,
        country: userData.country,
        followers: userData.followers.total,
        images: userData.images || [],
        product: userData.product,
      },
    });

    // 🍪 쿠키에 사용자 정보 저장
    response.cookies.set(
      'user_info',
      JSON.stringify({
        id: userData.id,
        display_name: userData.display_name,
        email: userData.email,
        country: userData.country,
        followers: userData.followers.total,
        image: userData.images?.[0]?.url,
        product: userData.product,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60, // 24시간
      }
    );

    return response;
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
