export interface Pomodoro {
  id: string;
  spotify_userId: string;
  name: string;
  work_time_playlist_id: string;
  work_time_playlist_name?: string
  work_time_playlist_image?: string
  break_time_playlist_id: string;
  break_time_playlist_name?: string
  break_time_playlist_image?: string
  work_time: number;
  break_time: number;
  term_count: number;
  long_break_time: number;
}
