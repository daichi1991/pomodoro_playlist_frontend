import { MusicContext } from "@/app/context/musicContext";
import { Pomodoro, SpotifyPlaylistItems } from "@/app/types";
import { useContext, useEffect, useRef, useState } from "react";
import { getPlaylists, pausePlayback, resumePlayback, startPlaylist } from "../../apis/spotify";

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
  const [pomodoroElementsState, setPomodoroElementsState] = useState<{ mode: string, playlist_id: string, time: number }[]>([]);
  const [currentPomodoroPosition, setCurrentPomodoroPosition] = useState(0);
  const [currentTerm, setCurrentTerm] = useState(0);
  const [playPomodoroState, setPlayPomodoroState] = useState<'play' | 'pause' | 'stop'>('stop');
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const intervalIds: NodeJS.Timeout[] = [];

  const getSpotifyPlaylist = (playlist_id: string, spotifyPlaylistItems: SpotifyPlaylistItems[]) => {
    const playlist = spotifyPlaylistItems.find((playlist) => playlist.id === playlist_id);
    return playlist
  }

  const handleStartPomodoro = async () => {
    setPlayPomodoroState('play');
    clearTimeout(timeoutId!);
    await countdownTimer(3000);
    await sleep(3000);
    for (let i = 0; i < pomodoroElementsState.length; i++) {
      setCurrentPomodoroPosition(i);
      await countdownTimer(pomodoroElementsState[i].time * 60 * 1000);
      await startPlaylist(pomodoroElementsState[i].playlist_id);
      await sleep(pomodoroElementsState[i].time * 60 * 1000);
    }
    await pausePlayback();
    setPlayPomodoroState('stop');
    clearTimeout(timeoutId!);
    clearAllIntervals();
  };

  const handlePausePomodoro = async () => {
    await pausePlayback();
    setPlayPomodoroState('pause');
    clearTimeout(timeoutId!);
    clearAllIntervals();
  }

  const handleResumePomodoro = async () => {
    clearTimeout(timeoutId!);
    clearAllIntervals();
    setPlayPomodoroState('play');
    const currentPosition = currentPomodoroPosition;
    console.log(pomodoroElementsState);
    console.log(currentPosition);
    for (let i = currentPosition; i < pomodoroElementsState.length; i++) {
      setCurrentPomodoroPosition(i);
      if (i === currentPosition) {
        await countdownTimer(countdownTime);
        await resumePlayback();
        await sleep(countdownTime);
      } else {
        await countdownTimer(pomodoroElementsState[i].time * 60 * 1000);
        await startPlaylist(pomodoroElementsState[i].playlist_id);
        await sleep(pomodoroElementsState[i].time * 60 * 1000);
      }
    }
    await pausePlayback();
    setPlayPomodoroState('stop');
    clearTimeout(timeoutId!);
    clearAllIntervals();
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
    intervalRef.current && clearInterval(intervalRef.current);
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
    // ポモドーロ情報の取得
    const handleGetPomodoro = async () => {
      if (pomodoroElementsState.length > 0) return;
      const spoitifyPlaylists = await getPlaylists();
      const work_time_playlist = getSpotifyPlaylist(pomodoro.work_time_playlist_id, spoitifyPlaylists);
      const break_time_playlist = getSpotifyPlaylist(pomodoro.break_time_playlist_id, spoitifyPlaylists);
      pomodoro.work_time_playlist_name = work_time_playlist!.name;
      pomodoro.work_time_playlist_image = work_time_playlist!.images[0].url;
      pomodoro.break_time_playlist_name = break_time_playlist!.name;
      pomodoro.break_time_playlist_image = break_time_playlist!.images[0].url;
      setPomodoroState(pomodoro);
      const pomodoroElements = [];
      for (let i = 0; i < pomodoro.term_count; i++) {
        pomodoroElements.push({ mode:'work', playlist_id: pomodoro.work_time_playlist_id, time: pomodoro.work_time });
        if (i !== pomodoro.term_count - 1) {
          pomodoroElements.push({ mode:'break', playlist_id: pomodoro.break_time_playlist_id, time: pomodoro.break_time });
        } else {
          pomodoroElements.push({ mode:'long_break', playlist_id: pomodoro.break_time_playlist_id, time: pomodoro.long_break_time });
        }
      }
      setPomodoroElementsState(pomodoroElements);
    };
    handleGetPomodoro();
  }, [pomodoro, pomodoroElementsState]);

  useEffect(() => {
    // Spotify Web Playback SDKの初期化
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) return;
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
  }
  , [player, setPlayer]);

  useEffect(() => {
    // beep音の再生
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
  }, [countdownTime]);

  useEffect(() => {
    if (pomodoroElementsState.length === 0) return;
    const handleSetCurrentTerm = () => {
      let term = 0;
      for (let i = 0; i < currentPomodoroPosition + 1; i++) {
        if (pomodoroElementsState[i].mode === 'work') {
          term++;
        }
      }
      setCurrentTerm(term);
    }
    handleSetCurrentTerm();
  }, [currentPomodoroPosition, pomodoroElementsState]);

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
    {pomodoroElementsState.length > 0 && (
      <div className="my-4 text-2xl">
        {pomodoroElementsState[currentPomodoroPosition].mode === 'work' ? '集中' : pomodoroElementsState[currentPomodoroPosition].mode === 'break' ? '休憩' : '全セット終了後の休憩'}
      </div>
    )}
    {currentTerm > 0 && (
      <div className="my-4 text-2xl">
        {currentTerm} / {pomodoro.term_count} セット
      </div>
    )}
    </>
  );
};
