'use client';

import { getOnePomodoro } from "@/app/apis/pomodoro";
import { getPlaylists } from "@/app/apis/spotify";
import { Pomodoro, SpotifyPlaylistItems } from "@/app/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PomodoroForm } from "../PomodoroForm/Index";

export const EditPomodoroForm: React.FC = () => {
  const params = useParams<{ slug: string }>();
  const [pomodoro, setPomodoro] = useState<Pomodoro | undefined>(undefined);

  const getSpotifyPlaylist = (playlist_id: string, spotifyPlaylistItems: SpotifyPlaylistItems[]) => {
    const playlist = spotifyPlaylistItems.find((playlist) => playlist.id === playlist_id);
    return playlist
  }

  useEffect(() => {
    if (!params.slug) return;
    const getPomodoro = async () => {
      const pomodoro_id = params.slug;
      if (!pomodoro_id) return;
      const response = await getOnePomodoro(pomodoro_id);
      const spoitifyPlaylists = await getPlaylists();
      if (spoitifyPlaylists.length === 0) return;
      const work_time_playlist = getSpotifyPlaylist(response.pomodoro.work_time_playlist_id, spoitifyPlaylists);
      const break_time_playlist = getSpotifyPlaylist(response.pomodoro.break_time_playlist_id, spoitifyPlaylists);
      response.pomodoro.work_time_playlist_name = work_time_playlist!.name;
      response.pomodoro.break_time_playlist_name = break_time_playlist!.name;
      setPomodoro(response.pomodoro);
    }
    getPomodoro();
  }, [params.slug]);

  return (
    <PomodoroForm
      mode={'update'}
      pomodoro={pomodoro}
    />
  )
};
