import { getIronSession, IronSession } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

// 수정: IronSession에 제네릭으로 SessionData 넣기
export type MySession = IronSession<SessionData>;

export const sessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: 'moodsync-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export async function getSession(): Promise<MySession> {
  const cookieStore = cookies();
  // 제네릭 인자에 MySession 넣기
  return getIronSession<SessionData>(await cookieStore, sessionOptions);
}
