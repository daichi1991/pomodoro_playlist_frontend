'use client';

import React from 'react';
import { MusicContext } from '../../context/musicContext';

export const Playlist: React.FC = () => {
  const { playlists, handleGetTracks, setSelectedPlaylist } = React.useContext(MusicContext);

  const handleSetPlaylist = (playlistId: string, playlistName: string) => {
    setSelectedPlaylist({ id: playlistId, name: playlistName });
    handleGetTracks(playlistId);
  };

  return (
    <div>
      <ul>
        {playlists?.map((playlist: any) => (
          <li key={playlist.id} onClick={() => handleSetPlaylist(playlist.id, playlist.name)}>
            {playlist.name}
          </li>
        ))}
      </ul>
    </div>
  );
};
