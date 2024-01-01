import { Pomodoro } from "@/app/types";
import { useEffect } from "react";

interface Props {
  pomodoro: Pomodoro;
}

export const PlayPomodoroConsole: React.FC<Props> = (props: Props) => {
  const pomodoro = props.pomodoro;

  const handleGetPomodoro = async () => {
    const work_time_playlist = await getPomodoroPlaylistFromSpotify(pomodoro.work_time_playlist_id);
    const break_time_playlist = await getPomodoroPlaylistFromSpotify(pomodoro.break_time_playlist_id);
    pomodoro.work_time_playlist_name = work_time_playlist.name;
    pomodoro.work_time_playlist_image = work_time_playlist.images[0].url;
    pomodoro.break_time_playlist_name = break_time_playlist.name;
    pomodoro.break_time_playlist_image = break_time_playlist.images[0].url;
  };
    
  const getPomodoroPlaylistFromSpotify = async (playlistId: string) => {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    const data = await response.json();
    return data;
  };

  useEffect(() => {
    handleGetPomodoro();
  }, []);

  return (
    <>
      <h1>Play Pomodoro</h1>
      {props.pomodoro.name}
    </>
  );
};
