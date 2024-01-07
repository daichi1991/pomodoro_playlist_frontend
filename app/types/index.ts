export interface Pomodoro {
  id?: string;
  spotify_userId?: string;
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
  term_repeat_count: number;
}

export interface SpotifyPlaylistItems {
  collaborative: boolean;
  description: string;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: {
    url: string;
    height: number;
    width: number;
  }[];
  name: string;
  owner: {
    external_urls: {
      spotify: string;
    };
    folowers: {
      href: string;
      total: number;
    };
    href: string;
    id: string;
    type: string;
    uri: string;
    display_name: string;
  };
  public: boolean;
  snapshot_id: string;
  tracks: {
    href: string;
    total: number;
  };
  type: string;
  uri: string;
}