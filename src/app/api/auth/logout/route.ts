import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('🔍 Processing logout...');
  
  const response = NextResponse.json({ message: 'Logged out successfully' });
  
  // 모든 인증 관련 쿠키 삭제
  response.cookies.delete('spotify_access_token');
  response.cookies.delete('spotify_refresh_token');
  response.cookies.delete('user_info');
  
  console.log('✅ Logout successful, cookies cleared');
  return response;
}