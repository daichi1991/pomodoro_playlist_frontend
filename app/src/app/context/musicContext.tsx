'use client';

import React, { createContext, useEffect, useState } from 'react';

interface MusicType {
  playlists: never[];
  setPlaylists: React.Dispatch<React.SetStateAction<never[]>>;
  handleGetPlaylists: () => void;
  selectedPlaylist: { id: string; name: string };
  setSelectedPlaylist: React.Dispatch<React.SetStateAction<{ id: string; name: string }>>;
  tracks: never[];
  setTracks: React.Dispatch<React.SetStateAction<never[]>>;
  handleGetTracks: (playlistId: string) => void;
  player: Spotify.Player | null;
  setPlayer: React.Dispatch<React.SetStateAction<Spotify.Player | null>>;
}

export const MusicContext = createContext<MusicType>({
  playlists: [],
  setPlaylists: () => {},
  handleGetPlaylists: () => {},
  selectedPlaylist: { id: '', name: '' },
  setSelectedPlaylist: () => {},
  tracks: [],
  setTracks: () => {},
  handleGetTracks: () => {},
  player: null,
  setPlayer: () => {},
});

interface MusicProviderProps {
  children: React.ReactNode;
}

export const MusicProvider = ({ children }: MusicProviderProps) => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState({ id: '', name: '' });
  const [tracks, setTracks] = useState([]);
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const handleGetPlaylists = async () => {
    if (!localStorage.getItem('access_token')) {
      return;
    }
    const response = await fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    const data = await response.json();
    setPlaylists(data.items);
  };

  const handleGetTracks = async (playlistId: string) => {
    if (!localStorage.getItem('access_token')) {
      return;
    }
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    const data = await response.json();
    setTracks(data.items);
  };

  useEffect(() => {
    handleGetPlaylists();
  }, []);

  return (
    <MusicContext.Provider
      value={{
        playlists,
        setPlaylists,
        handleGetPlaylists,
        selectedPlaylist,
        setSelectedPlaylist,
        tracks,
        setTracks,
        handleGetTracks,
        player,
        setPlayer,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export default MusicProvider;
