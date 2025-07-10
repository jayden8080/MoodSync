'use server';

import { getSession } from '@/lib/session';
import SpotifyWebApi from 'spotify-web-api-node';

export async function createPlaylistOnSpotify(songs: string[]): Promise<{ playlistUrl?: string, error?: string }> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('Missing Spotify environment variables for creating playlist');
    return { error: '서버에 Spotify API 정보가 설정되지 않았습니다.' };
  }
  
  const session = await getSession();
  if (!session.accessToken) {
    return { error: '인증되지 않았습니다. 다시 로그인해주세요.' };
  }

  const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret,
    accessToken: session.accessToken,
  });

  try {
    // In a production app, you would implement token refresh logic here.
    // We check if the token is expired and refresh it if needed.
    if (session.expiresAt && Date.now() > session.expiresAt) {
      spotifyApi.setRefreshToken(session.refreshToken!);
      const data = await spotifyApi.refreshAccessToken();
      session.accessToken = data.body['access_token'];
      session.expiresAt = Date.now() + data.body['expires_in'] * 1000;
      await session.save();
      spotifyApi.setAccessToken(session.accessToken);
    }

    const trackUris: string[] = [];
    for (const song of songs) {
      // The AI returns "Song Title by Artist", which is a great search query.
      const result = await spotifyApi.searchTracks(song, { limit: 1 });
      if (result.body.tracks?.items[0]) {
        trackUris.push(result.body.tracks.items[0].uri);
      }
    }

    if (trackUris.length === 0) {
      return { error: 'Spotify에서 추천된 노래를 찾을 수 없습니다.' };
    }
    
    const playlistName = `MoodSync: ${new Date().toLocaleDateString('ko-KR')}`;
    const playlist = await spotifyApi.createPlaylist(playlistName, {
      description: `MoodSync AI가 당신의 기분을 위해 생성한 플레이리스트입니다.`,
      public: false,
    });
    
    await spotifyApi.addTracksToPlaylist(playlist.body.id, trackUris);

    return { playlistUrl: playlist.body.external_urls.spotify };

  } catch (err: any) {
    console.error('Spotify API 오류:', err);
    if (err.statusCode === 401) {
        session.destroy();
        return { error: '인증이 만료되었습니다. 다시 로그인해주세요.' };
    }
    return { error: 'Spotify에서 플레이리스트 생성에 실패했습니다.' };
  }
}
