'use client';

import { pausePlayback, resumePlayback, startPlaylist, transferPlayback } from "@/app/apis/spotify";
import { Pomodoro } from "@/app/types";
import { useEffect, useRef, useState } from "react";
import { TimeAllocationBar } from "../TimeAllocationBar/Index";

interface Props {
  pomodoro: Pomodoro;
  open: boolean;
  closeModalOnClick: () => void;
}

export const PlayPomodoroModal: React.FC<Props> = (props: Props) => {
  const pomodoro = props.pomodoro;
  const open = props.open;
  const closeModalOnClick = props.closeModalOnClick;

  // const { player, setPlayer } = useContext(MusicContext);
  const [ player, setPlayer ] = useState<Spotify.Player | null>(null);

  const playerRef = useRef<Spotify.Player | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const intervalIds: NodeJS.Timeout[] = [];

  const [deviceId, setDeviceId] = useState('');
  const [playPomodoroState, setPlayPomodoroState] = useState<'play' | 'pause' | 'stop'>('stop');
  const [isRunningCountupTimer, setIsRunningCountupTimer] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [currentTermRestTime, setCurrentTermRestTime] = useState(0);
  const [pomodoroElementsState, setPomodoroElementsState] = useState<{ mode: string, playlist_id: string, time: number, term: number, term_repeat: number }[]>([]);
  const [currentPomodoroPosition, setCurrentPomodoroPosition] = useState(0);
  const [currentTerm, setCurrentTerm] = useState(0);
  const [currentTermRepeat, setCurrentTermRepeat] = useState(0);
  const [countupTime, setCountupTime] = useState(0)
  const [goNextTrack, setGoNextTrack] = useState(false);
  const [countdownTime, setCountdownTime] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState<string>('from-blue-800/90 to-green-800/90');

  const handleCloseModal = () => {
    finishPomodoro();
    closeModalOnClick();
  }

  const finishPomodoro = () => {
    pausePlayback();
    clearAllIntervals();
    setIsRunningCountupTimer(false);
    setPlayPomodoroState('stop');
    setCountupTime(0);
    setCurrentPomodoroPosition(0);
    setCurrentTerm(0);
    setCurrentTermRepeat(0);
    setGoNextTrack(false);
    setCountdownTime(0);
  }

  const handleStartPomodoro = async () => {
    setPlayPomodoroState('play');
    await countdownTimer(3000);
    await sleep(3000);
    clearAllIntervals();
    setIsRunningCountupTimer(true);
  };

  const handlePausePomodoro = async () => {
    await pausePlayback();
    setPlayPomodoroState('pause');
    setIsRunningCountupTimer(false);
    clearTimeout(timeoutId!);
    clearAllIntervals();
  }

  const handleResumePomodoro = async () => {
    console.log('handleResumePomodoro');
    setIsRunningCountupTimer(true);
    resumePlayback();
    setPlayPomodoroState('play');
  }

  const countdownTimer = async (ms: number) => {
    intervalRef.current && clearInterval(intervalRef.current);
    setCountdownTime(ms);
    intervalRef.current = setInterval(() => {
      setCountdownTime(prev => prev - 1000);
    }, 1000);
    intervalIds.push(intervalRef.current);
  };

  const sleep = (ms: number) => {
    const promise = new Promise((resolve, reject) => {
      const timeoutId = setTimeout(resolve, ms);
      setTimeoutId(timeoutId);
    });
    return promise;
  }

  const clearAllIntervals = () => {
    intervalRef.current && clearInterval(intervalRef.current);
    intervalIds.forEach(intervalId => {
      intervalId && clearInterval(intervalId);
    });
  }

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const formattedTime = `${padZero(minutes)}:${padZero(seconds - minutes * 60)}`;
    return formattedTime;
  }

  const padZero = (num: number) => {
    return num < 10 ? `0${num}` : num;
  }

  useEffect(() => {
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
  }, [pomodoro]);

  useEffect(() => {
    // Spotify Web Playback SDKの初期化
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) return;
    if (accessToken) {
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
          transferPlayback(device_id)
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
  }, []);
  
  useEffect(() => {
    // カウントアップタイマーの設定
    let countupTimer: NodeJS.Timeout;
    if (isRunningCountupTimer) {
      countupTimer = setInterval(() => {
        setCountupTime(prev => prev + 1000);
      }, 1000);
    }
    return () => {
      clearInterval(countupTimer);
    }
  }, [isRunningCountupTimer, currentPomodoroPosition]);

  useEffect(() => {
    // ポモドーロの進捗をチェック
    if (!isRunningCountupTimer) return;
    const changeTrackTime:number[] = [0]
    if (pomodoroElementsState.length === 0) return;
    pomodoroElementsState.forEach((pomodoroElement, index) => {
      changeTrackTime.push(changeTrackTime[changeTrackTime.length - 1] + pomodoroElement.time);
    });
    if (changeTrackTime.length === 1) return;
    if (changeTrackTime[changeTrackTime.length - 1] === countupTime) {
      finishPomodoro();
      return;
    }
    if (changeTrackTime.includes(countupTime)) {
      setGoNextTrack(true);
      if (countupTime !== 0) {
        setCurrentPomodoroPosition(prev => prev + 1);
      }
    }
  }, [countupTime, pomodoroElementsState, isRunningCountupTimer])

  useEffect(() => {
    // ポモドーロの進捗に応じてプレイリストを再生
    if (!isRunningCountupTimer) return;
    if (pomodoroElementsState.length === 0) return;
    if (!goNextTrack) return;
    startPlaylist(pomodoroElementsState[currentPomodoroPosition].playlist_id);
    setGoNextTrack(false);
  }, [currentPomodoroPosition, isRunningCountupTimer, pomodoroElementsState, goNextTrack]);


  useEffect(() => {
    // ポモドーロの進捗に応じて現在のセット数を設定
    if (pomodoroElementsState.length === 0) return;
    setCurrentTerm(pomodoroElementsState[currentPomodoroPosition].term);
    setCurrentTermRepeat(pomodoroElementsState[currentPomodoroPosition].term_repeat);
  }, [currentPomodoroPosition, pomodoroElementsState]);


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
    }
    if (currentTermRestTime === 3000 || currentTermRestTime === 2000 || currentTermRestTime === 1000) {
      beep();
    }
  }, [currentTermRestTime]);

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
    }
    if (countdownTime === 3000 || countdownTime === 2000 || countdownTime === 1000) {
      beep();
    }
  }, [countdownTime])
  
  useEffect(() => {
    // 現在のセットの残り時間を設定
    if (pomodoroElementsState.length === 0) return;
    const calcCurrentTermRestTime = () => {
      let startSum = 0;
      for (let i = 0; i < currentPomodoroPosition + 1; i++) {
        startSum += pomodoroElementsState[i].time;
      }
      const currentTermRestTime = startSum - countupTime;
      setCurrentTermRestTime(currentTermRestTime);
    }
    calcCurrentTermRestTime();
  }, [countupTime, currentPomodoroPosition, pomodoroElementsState]);

  useEffect(() => {
    // 背景色の設定
    if (pomodoroElementsState.length === 0) return;

    const calcBackgroundColor = () => {
      if (pomodoroElementsState[currentPomodoroPosition].mode === 'work') {
        setBackgroundColor('animate-focus-bg-color')
      } else {
        setBackgroundColor('animate-break-bg-color')
      }
    }
    calcBackgroundColor();
  }, [currentPomodoroPosition, pomodoroElementsState]);

  return (
    <>
      {open && (
        <div key={open ? 'modal-open' : 'modal-closed'} id="overlay" className={`${open ? 'animate-fade-in-up' : 'animate-fade-out-down'} transform fixed top-0 left-0 w-full h-full bg-gradient-to-br ${backgroundColor} items-center justify-center`}>
          {/* <div id="default-modal" tabIndex={-1} aria-hidden="true" className="justify-center items-center w-full h-full"> */}
          <div id="default-modal" tabIndex={-1} aria-hidden="true" className="justify-center items-center w-full h-full">
          <div className="relative p-10 w-full h-full">
              <div className="relative bg-gray-900/60 backdrop-blur-lg rounded-3xl border border-gray-900/60 shadow-lg p-10 w-full h-full text-center">
                {player && (
            playPomodoroState === 'stop' ? (
                    <button onClick={() => handleStartPomodoro()} className="text-4xl text-gray-200 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg w-60 h-20 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                      始める
                    </button>
          ) : (
          playPomodoroState === 'pause' ? (
            <button
              type="button"
              className="bg-white text-slate-900 transition-all duration-500 dark:bg-slate-100 dark:text-slate-700 flex-none -my-2 mx-auto w-20 h-20 rounded-full ring-1 ring-slate-900/5 shadow-md flex items-center justify-center"
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
              className="bg-white text-slate-900 transition-all duration-500 dark:bg-slate-100 dark:text-slate-700 flex-none -my-2 mx-auto w-20 h-20 rounded-full ring-1 ring-slate-900/5 shadow-md flex items-center justify-center"
              onClick={() => {
                handlePausePomodoro();
              }}
            >
              <svg width="30" height="32" fill="currentColor">
                <rect x="6" y="4" width="4" height="24" rx="2"></rect>
                <rect x="20" y="4" width="4" height="24" rx="2"></rect>
              </svg>
            </button>
          ))
        )
        }
        {pomodoroElementsState.length > 0 && (
          <div className="my-8 text-9xl">
            {pomodoroElementsState[currentPomodoroPosition].mode === 'work' ? '集中' : pomodoroElementsState[currentPomodoroPosition].mode === 'break' ? '休憩' : '長めの休憩'}
          </div>
        )}
        {currentTermRestTime > 0 && (
        <div className="my-4 text-6xl">
          {formatTime(currentTermRestTime)}
        </div>
        )}
        {currentTerm > 0 && (
          <div className="my-4 text-xl">
            {currentTerm} / {pomodoro.term_count} 回目
          </div>
        )}
        {currentTermRepeat > 0 && (
        <div className="my-4 text-xl">
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
        />
        <button
          type="button"
          className="text-2xl text-gray-200 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg w-40 h-20 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          onClick={() => handleCloseModal()}
        >
          終了する
        </button>
              </div>
            </div>
          </div>
      </div>
    )}
    </>
  )
}