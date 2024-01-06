import { MusicContext } from "@/app/context/musicContext";
import { Pomodoro } from "@/app/types";
import { useContext, useEffect, useRef, useState } from "react";
import { pausePlayback, startPlaylist } from "../../apis/spotify";

interface Props {
  pomodoro: Pomodoro;
}

export const PlayPomodoroConsole: React.FC<Props> = (props: Props) => {
  const pomodoro = props.pomodoro;
  const { player, setPlayer } = useContext(MusicContext);
  const [pomodoroState, setPomodoroState] = useState<Pomodoro>(pomodoro);
  const playerRef = useRef<Spotify.Player | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [deviceId, setDeviceId] = useState('');
  const [countdownTime, setCountdownTime] = useState(0);
  const [pomodoroElementsState, setPomodoroElementsState] = useState<{ playlist_id: string, time: number }[]>([]);
  const [currentPomodoroPosition, setCurrentPomodoroPosition] = useState(0);
  const [playPomodoroState, setPlayPomodoroState] = useState<'play' | 'pause' | 'stop'>('stop');
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const intervalIds: NodeJS.Timeout[] = [];

  const getPomodoroPlaylistFromSpotify = async (playlistId: string) => {
    if (!playlistId) return;
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    const data = await response.json();
    return data;
  };

  const handleStartPomodoro = async () => {
    setPlayPomodoroState('play');
    clearTimeout(timeoutId!);
    await countdownTimer(3000);
    await sleep(3000);
    for (let i = 0; i < pomodoroElementsState.length; i++) {
      await countdownTimer(pomodoroElementsState[i].time * 60 * 1000);
      await startPlaylist(pomodoroElementsState[i].playlist_id);
      setCurrentPomodoroPosition(i);
      await sleep(pomodoroElementsState[i].time * 60 * 1000);
    }
  };

  const handlePausePomodoro = async () => {
    intervalRef.current && clearInterval(intervalRef.current);
    await pausePlayback();
    setPlayPomodoroState('pause');
    clearTimeout(timeoutId!);
    clearAllIntervals();
  }

  const handleResumePomodoro = async () => {
    intervalRef.current && clearInterval(intervalRef.current);
    clearTimeout(timeoutId!);
    clearAllIntervals();
    player?.resume();
    setPlayPomodoroState('play');
    for (let i = currentPomodoroPosition; i < pomodoroElementsState.length; i++) {
      await countdownTimer(countdownTime);
      await startPlaylist(pomodoroElementsState[i].playlist_id);
      setCurrentPomodoroPosition(i);
      await sleep(pomodoroElementsState[i].time * 60 * 1000);
    }
  }

  const countdownTimer = async (ms: number) => {
    intervalRef.current && clearInterval(intervalRef.current);
    setCountdownTime(ms);
    intervalRef.current = setInterval(() => {
      setCountdownTime(prev => prev - 1000);
    }, 1000);
    intervalIds.push(intervalRef.current);
  };

  const clearAllIntervals = () => {
    intervalIds.forEach(intervalId => {
      intervalId && clearInterval(intervalId);
    });
  }

  // const sleep = async (ms: number) => {
  //   await new Promise(resolve => setTimeout(resolve, ms));
  // }
  const sleep = (ms: number) => {
    const promise = new Promise((resolve, reject) => {
      const timeoutId = setTimeout(resolve, ms);
      setTimeoutId(timeoutId);
    });
    return promise;
  }

  useEffect(() => {
    const handleGetPomodoro = async () => {
      if (pomodoroElementsState.length > 0) return;
      const work_time_playlist = await getPomodoroPlaylistFromSpotify(pomodoro.work_time_playlist_id);
      const break_time_playlist = await getPomodoroPlaylistFromSpotify(pomodoro.break_time_playlist_id);
      pomodoro.work_time_playlist_name = work_time_playlist.name;
      pomodoro.work_time_playlist_image = work_time_playlist.images[0].url;
      pomodoro.break_time_playlist_name = break_time_playlist.name;
      pomodoro.break_time_playlist_image = break_time_playlist.images[0].url;
      setPomodoroState(pomodoro);
      const pomodoroElements = [];
      for (let i = 0; i < pomodoro.term_count; i++) {
        pomodoroElements.push({ playlist_id: pomodoro.work_time_playlist_id, time: pomodoro.work_time });
        if (i !== pomodoro.term_count - 1) {
          pomodoroElements.push({ playlist_id: pomodoro.break_time_playlist_id, time: pomodoro.break_time });
        } else {
          pomodoroElements.push({ playlist_id: pomodoro.break_time_playlist_id, time: pomodoro.long_break_time });
        }
      }
      setPomodoroElementsState(pomodoroElements);
    };
    handleGetPomodoro();
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      if (player) return;
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
    const beep = async () => {
      const ctx1 = new window.AudioContext
      const oscillator1 = ctx1.createOscillator();
      oscillator1.type = "sine";
      oscillator1.frequency.setValueAtTime(440, ctx1.currentTime);
      oscillator1.connect(ctx1.destination);
      oscillator1.start();
      oscillator1.stop(ctx1.currentTime + 0.2);
      await sleep(1000);
    }
    if (countdownTime === 3000 || countdownTime === 2000 || countdownTime === 1000) {
      beep();
    }
  }, [pomodoro, pomodoroState, setPlayer, setPomodoroState, countdownTime, setCountdownTime, pomodoroElementsState]);

  return (
    <>
      <div className="flex p-8">
        <div className="flex flex-col">
          <div>
            <svg
              className="w-80 h-80"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <image xlinkHref={pomodoro.work_time_playlist_image!} x="0" y="0" height="100%" width="100%" />
            </svg>
          </div>
          <div>
            <div className="my-4 text-4xl">{pomodoro.work_time_playlist_name}</div>
            <div className="my-4 text-2xl">集中時間： {pomodoro.work_time} 分</div>
          </div>
        </div>
        <div className="mx-8 bg-gray-500 w-px h-auto"></div>
        <div className="flex flex-col">
          <div>
            <svg
              className="w-80 h-80"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <image xlinkHref={pomodoro.break_time_playlist_image!} x="0" y="0" height="100%" width="100%" />
            </svg>
          </div>
          <div>
            <div className="my-4 text-4xl">{pomodoro.break_time_playlist_name}</div>
            <div className="my-4 text-2xl">休憩時間： {pomodoro.break_time} 分</div>
          </div>
        </div>
      </div>
      <hr className="h-px w-10/12 bg-gray-500" />
      <div className="my-4 text-2xl">
        セット数： {pomodoro.term_count}
      </div>
      <hr className="h-px w-10/12 bg-gray-500" />
      <div className="my-4 text-2xl">
        全セット終了後の休憩時間： {pomodoro.long_break_time} 分
      </div>
      {
        player && (
          playPomodoroState === 'stop' ? (
          <button onClick={() => handleStartPomodoro()}>開始</button>
          ) : (
          playPomodoroState === 'pause' ? (
            <button
              type="button"
              className="bg-white text-slate-900 transition-all duration-500 dark:bg-slate-100 transition-all duration-500 dark:text-slate-700 flex-none -my-2 mx-auto w-20 h-20 rounded-full ring-1 ring-slate-900/5 shadow-md flex items-center justify-center"
              aria-label="play"
                onClick={() => {
                handleResumePomodoro();
              }}
            >
              <svg width="30" height="30" fill="currentColor">
                <path d="M5 0 L30 15 L5 30 Z"></path>
              </svg>
            </button>
            ) : (
              <button
                className="bg-white text-slate-900 transition-all duration-500 dark:bg-slate-100 transition-all duration-500 dark:text-slate-700 flex-none -my-2 mx-auto w-20 h-20 rounded-full ring-1 ring-slate-900/5 shadow-md flex items-center justify-center"
                onClick={() => {
                  handlePausePomodoro();
                }}
              >
                <svg width="30" height="32" fill="currentColor">
                  <rect x="6" y="4" width="4" height="24" rx="2"></rect>
                  <rect x="20" y="4" width="4" height="24" rx="2"></rect>
                </svg>
              </button>
          )
        )
        )
      }

    {countdownTime > 0 && (
      <div className="my-4 text-2xl">
        {countdownTime / 1000}
      </div>
    )}
    </>
  );
};
