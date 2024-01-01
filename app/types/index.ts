export interface Pomodoro {
  id: string;
  spotify_userId: string;
  name: string;
  work_time_playlist_id: string;
  work_time_playlist_name: string | null;
  work_time_playlist_image: string | null;
  break_time_playlist_id: string;
  break_time_playlist_name: string | null;
  break_time_playlist_image: string | null;
  work_time: number;
  break_time: number;
  term_count: number;
  long_break_time: number;
}
