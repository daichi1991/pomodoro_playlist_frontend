'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MusicContext } from '../../context/musicContext';

export const Tracks: React.FC = () => {
  const [deviceId, setDeviceId] = useState('');
  const playerRef = useRef<Spotify.Player | null>(null);
  const { tracks, selectedPlaylist, setPlayer } = React.useContext(MusicContext);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      // window.onSpotifyWebPlaybackSDKReadyのコールバックを定義する
      // SDKが読み込まれたタイミングでこのコールバックが実行される
      window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new Spotify.Player({
          name: 'pomodoro_playlist',
          getOAuthToken: async (cb) => {
            cb(accessToken as string);
          },
          volume: 0.5,
        });
        player.addListener('ready', ({ device_id }) => {
          // ここで楽曲を再生する際に必要なdevice_idを取得してstateに格納しておく
          setDeviceId(device_id);
        });
        player.connect();
        playerRef.current = player;
        setPlayer(player);
      };
      if (!window.Spotify) {
        // Web Playback SDKを読み込む
        const scriptTag = document.createElement('script');
        scriptTag.src = 'https://sdk.scdn.co/spotify-player.js';
        document.head!.appendChild(scriptTag);
      }
    }
  }, []);

  const handlePlayingTrack = (track: Spotify.Track) => {
    const accessToken = localStorage.getItem('access_token');
    try {
      // '/api/track/play'で'https://api.spotify.com/v1/me/player/play'にパラメータを送る
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          uris: [track.uri],
        }),
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <div>{selectedPlaylist.name}</div>
      <ul>
        {tracks?.map((track: any) => (
          <li key={track.track.id} onClick={() => handlePlayingTrack(track.track)}>
            {track.track.name}
          </li>
        ))}
      </ul>
    </div>
  );
};
