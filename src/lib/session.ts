import { getIronSession, IronSession, IronSessionData } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData extends IronSessionData {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

export const sessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: 'moodsync-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export function getSession() {
  return getIronSession<SessionData>(cookies(), sessionOptions);
}
