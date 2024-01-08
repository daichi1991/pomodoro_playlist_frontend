import { MusicContext } from "@/app/context/musicContext";
import { Pomodoro, SpotifyPlaylistItems } from "@/app/types";
import { useContext, useEffect, useRef, useState } from "react";
import { getPlaylists } from "../../apis/spotify";
import { PlayPomodoroModal } from "../PlayPomodoroModal/Index";

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
  const [countupTime, setCountupTime] = useState(0)
  const [isRunningCountupTimer, setIsRunningCountupTimer] = useState(false);
  const [pomodoroElementsState, setPomodoroElementsState] = useState<{ mode: string, playlist_id: string, time: number, term: number, term_repeat: number }[]>([]);
  const [currentPomodoroPosition, setCurrentPomodoroPosition] = useState(0);
  const [currentTerm, setCurrentTerm] = useState(0);
  const [currentTermRestTime, setCurrentTermRestTime] = useState(0);
  const [currentTermRepeat, setCurrentTermRepeat] = useState(0);
  const [goNextTrack, setGoNextTrack] = useState(false);
  const [playPomodoroState, setPlayPomodoroState] = useState<'play' | 'pause' | 'stop'>('stop');
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const intervalIds: NodeJS.Timeout[] = [];

  const [isModalOpen, setIsModalOpen] = useState(false);

  const getSpotifyPlaylist = (playlist_id: string, spotifyPlaylistItems: SpotifyPlaylistItems[]) => {
    const playlist = spotifyPlaylistItems.find((playlist) => playlist.id === playlist_id);
    return playlist
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  // const handleStartPomodoro = async () => {
  //   setPlayPomodoroState('play');
  //   await countdownTimer(3000);
  //   await sleep(3000);
  //   clearAllIntervals();
  //   setIsRunningCountupTimer(true);
  // };

  // const handlePausePomodoro = async () => {
  //   await pausePlayback();
  //   setPlayPomodoroState('pause');
  //   setIsRunningCountupTimer(false);
  //   clearTimeout(timeoutId!);
  //   clearAllIntervals();
  // }

  // const handleResumePomodoro = async () => {
  //   setIsRunningCountupTimer(true);
  //   resumePlayback();
  //   setPlayPomodoroState('play');
  // }

  // const countdownTimer = async (ms: number) => {
  //   intervalRef.current && clearInterval(intervalRef.current);
  //   setCountdownTime(ms);
  //   intervalRef.current = setInterval(() => {
  //     setCountdownTime(prev => prev - 1000);
  //   }, 1000);
  //   intervalIds.push(intervalRef.current);
  // };

  // const clearAllIntervals = () => {
  //   intervalRef.current && clearInterval(intervalRef.current);
  //   intervalIds.forEach(intervalId => {
  //     intervalId && clearInterval(intervalId);
  //   });
  // }

  // const sleep = (ms: number) => {
  //   const promise = new Promise((resolve, reject) => {
  //     const timeoutId = setTimeout(resolve, ms);
  //     setTimeoutId(timeoutId);
  //   });
  //   return promise;
  // }

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
      for (let i = 0; i < pomodoro.term_repeat_count; i++) {
        for (let j = 0; j < pomodoro.term_count; j++) {
          pomodoroElements.push({ mode:'work', playlist_id: pomodoro.work_time_playlist_id, time: pomodoro.work_time, term: j + 1, term_repeat: i + 1 });
          if (j !== pomodoro.term_count - 1) {
            pomodoroElements.push({ mode:'break', playlist_id: pomodoro.break_time_playlist_id, time: pomodoro.break_time, term: j + 1, term_repeat: i + 1 });
          } else {
            pomodoroElements.push({ mode:'long_break', playlist_id: pomodoro.break_time_playlist_id, time: pomodoro.long_break_time, term: j + 1, term_repeat: i + 1 });
          }
        }
      }
      setPomodoroElementsState(pomodoroElements);
    };
    handleGetPomodoro();
  }, [pomodoro, pomodoroElementsState]);

  // useEffect(() => {
  //   // Spotify Web Playback SDKの初期化
  //   const accessToken = localStorage.getItem('access_token');
  //   if (!accessToken) return;
  //   if (accessToken) {
  //     if (player) return;
  //     // window.onSpotifyWebPlaybackSDKReadyのコールバックを定義する
  //     // SDKが読み込まれたタイミングでこのコールバックが実行される
  //     window.onSpotifyWebPlaybackSDKReady = () => {
  //       const player = new Spotify.Player({
  //         name: 'pomodoro_playlist',
  //         getOAuthToken: async (cb) => {
  //           cb(accessToken as string);
  //         },
  //         volume: 0.5,
  //       });
  //       player.addListener('ready', ({ device_id }) => {
  //         // ここで楽曲を再生する際に必要なdevice_idを取得してstateに格納しておく
  //         setDeviceId(device_id);
  //       });
  //       player.connect();
  //       playerRef.current = player;
  //       setPlayer(player);
  //     };
  //     if (!window.Spotify) {
  //       // Web Playback SDKを読み込む
  //       const scriptTag = document.createElement('script');
  //       scriptTag.src = 'https://sdk.scdn.co/spotify-player.js';
  //       document.head!.appendChild(scriptTag);
  //     }
  //   }
  // }
  // , []);

  // useEffect(() => {
  //   // カウントアップタイマーの設定
  //   let countupTimer: NodeJS.Timeout;
  //   if (isRunningCountupTimer) {
  //     countupTimer = setInterval(() => {
  //       setCountupTime(prev => prev + 1000);
  //     }, 1000);
  //   }
  //   return () => {
  //     clearInterval(countupTimer);
  //   }
  // }, [isRunningCountupTimer, currentPomodoroPosition]);

  // useEffect(() => {
  //   // ポモドーロの進捗をチェック
  //   if (!isRunningCountupTimer) return;
  //   const changeTrackTime:number[] = [0]
  //   if (pomodoroElementsState.length === 0) return;
  //   pomodoroElementsState.forEach((pomodoroElement, index) => {
  //     changeTrackTime.push(changeTrackTime[changeTrackTime.length - 1] + pomodoroElement.time);
  //   });
  //   if (changeTrackTime.length === 1) return;
  //   if (changeTrackTime[changeTrackTime.length - 1] === countupTime) {
  //     pausePlayback();
  //     setPlayPomodoroState('stop');
  //     setIsRunningCountupTimer(false);
  //     return;
  //   }
  //   if (changeTrackTime.includes(countupTime)) {
  //     console.log('trackChange')
  //     setGoNextTrack(true);
  //     if (countupTime !== 0) {
  //       setCurrentPomodoroPosition(prev => prev + 1);
  //     }
  //   }
  // }, [countupTime, pomodoroElementsState, isRunningCountupTimer])

  // useEffect(() => {
  //   // ポモドーロの進捗に応じてプレイリストを再生
  //   if (!isRunningCountupTimer) return;
  //   if (pomodoroElementsState.length === 0) return;
  //   if (!goNextTrack) return;
  //   startPlaylist(pomodoroElementsState[currentPomodoroPosition].playlist_id);
  //   setGoNextTrack(false);
  // }, [currentPomodoroPosition, isRunningCountupTimer, pomodoroElementsState, goNextTrack]);


  // useEffect(() => {
  //   // ポモドーロの進捗に応じて現在のセット数を設定
  //   if (pomodoroElementsState.length === 0) return;
  //   setCurrentTerm(pomodoroElementsState[currentPomodoroPosition].term);
  //   setCurrentTermRepeat(pomodoroElementsState[currentPomodoroPosition].term_repeat);
  // }, [currentPomodoroPosition, pomodoroElementsState]);


  // useEffect(() => {
  //   // beep音の再生
  //   const beep = async () => {
  //     const ctx1 = new window.AudioContext
  //     const oscillator1 = ctx1.createOscillator();
  //     oscillator1.type = "sine";
  //     oscillator1.frequency.setValueAtTime(440, ctx1.currentTime);
  //     oscillator1.connect(ctx1.destination);
  //     oscillator1.start();
  //     oscillator1.stop(ctx1.currentTime + 0.2);
  //   }
  //   if (currentTermRestTime === 3000 || currentTermRestTime === 2000 || currentTermRestTime === 1000) {
  //     beep();
  //     console.log('beep', currentTermRestTime);
  //   }
  // }, [currentTermRestTime]);

  // useEffect(() => {
  //   // beep音の再生
  //   const beep = async () => {
  //     const ctx1 = new window.AudioContext
  //     const oscillator1 = ctx1.createOscillator();
  //     oscillator1.type = "sine";
  //     oscillator1.frequency.setValueAtTime(440, ctx1.currentTime);
  //     oscillator1.connect(ctx1.destination);
  //     oscillator1.start();
  //     oscillator1.stop(ctx1.currentTime + 0.2);
  //   }
  //   if (countdownTime === 3000 || countdownTime === 2000 || countdownTime === 1000) {
  //     beep();
  //     console.log('beep', countdownTime);
  //   }
  // }, [countdownTime])
  
  // useEffect(() => {
  //   // 現在のセットの残り時間を設定
  //   if (pomodoroElementsState.length === 0) return;
  //   const calcCurrentTermRestTime = () => {
  //     let startSum = 0;
  //     for (let i = 0; i < currentPomodoroPosition + 1; i++) {
  //       startSum += pomodoroElementsState[i].time;
  //     }
  //     const currentTermRestTime = startSum - countupTime;
  //     setCurrentTermRestTime(currentTermRestTime);
  //   }
  //   calcCurrentTermRestTime();
  // }, [countupTime, currentPomodoroPosition, pomodoroElementsState]);

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
            <div className="my-4 text-2xl">集中時間： {pomodoro.work_time / 60 / 1000} 分</div>
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
            <div className="my-4 text-2xl">休憩時間： {pomodoro.break_time / 60 / 1000} 分</div>
          </div>
        </div>
      </div>
      <hr className="h-px w-10/12 bg-gray-500" />
      <div className="my-4 text-2xl">
        セット数： {pomodoro.term_count}
      </div>
      <hr className="h-px w-10/12 bg-gray-500" />
      <div className="my-4 text-2xl">
        全セット終了後の休憩時間： {pomodoro.long_break_time / 60 / 1000} 分
      </div>
      <button onClick={() => setIsModalOpen(true)}>
        モーダルを開く
      </button>
{/* 
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

      {currentTermRestTime > 0 && (
        <div className="my-4 text-2xl">
          {currentTermRestTime / 1000} 秒
        </div>
      )}
      {pomodoroElementsState.length > 0 && (
        <div className="my-4 text-2xl">
          {pomodoroElementsState[currentPomodoroPosition].mode === 'work' ? '集中' : pomodoroElementsState[currentPomodoroPosition].mode === 'break' ? '休憩' : '全セット終了後の休憩'}
        </div>
      )}
      {currentTerm > 0 && (
        <div className="my-4 text-2xl">
          {currentTerm} / {pomodoro.term_count} 回目
        </div>
      )}
      {currentTermRepeat > 0 && (
      <div className="my-4 text-2xl">
          {currentTermRepeat} / {pomodoro.term_repeat_count} セット
      </div>
      )}
      <TimeAllocationBar
        workTime={pomodoro.work_time}
        breakTime={pomodoro.break_time}
        longBreakTime={pomodoro.long_break_time}
        termCount={pomodoro.term_count}
        termRepeatCount={pomodoro.term_repeat_count}
        progress={countupTime}
      /> */}
      <PlayPomodoroModal
        open={isModalOpen}
        pomodoro={pomodoro}
        closeModalOnClick={handleCloseModal}
      />
    </>
  );
};
