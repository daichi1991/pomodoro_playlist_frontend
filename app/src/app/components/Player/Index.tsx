'use client';

import { MusicContext } from '@/app/context/musicContext';
import React, { useEffect, useRef, useState } from 'react';

export const Player: React.FC = () => {
  const [playerState, setPlayerState] = useState<Spotify.PlaybackState | null>(null);
  const [playingPosition, setPlayingPosition] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { player } = React.useContext(MusicContext);

  const millisecondsToMinutesAndSeconds = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toLocaleString('en-US', { minimumIntegerDigits: 2 })}`;
  };

  const countUpPlayingPosition = () => {
    if (player) {
      player.addListener('player_state_changed', (state) => {
        setPlayerState(state);
        setPlayingPosition(state.position);
      });
    }
    intervalRef.current = setInterval(() => {
      setPlayingPosition((prevTime) => prevTime + 10);
    }, 10);
  };

  const pausePlayingPosition = () => {
    clearInterval(intervalRef.current as unknown as number);
    if (player) {
      player.addListener('player_state_changed', (state) => {
        setPlayerState(state);
        setPlayingPosition(state.position);
      });
    }
  };

  useEffect(() => {
    if (player) {
      player.addListener('player_state_changed', (state) => {
        setPlayerState(state);
        setPlayingPosition(state.position);
      });
      if (!playerState?.paused) {
        intervalRef.current = setInterval(() => {
          setPlayingPosition((prevTime) => prevTime + 10);
        }, 10);
      }
    }
  }, [player]);

  return (
    <div className=" w-4/5 mt-6 sm:mt-10 relative z-10 rounded-xl shadow-xl">
      <div className="bg-white border-slate-100 transition-all duration-500 dark:bg-slate-800 transition-all duration-500 dark:border-slate-500 border-b rounded-t-xl p-4 pb-6 sm:p-10 sm:pb-8 lg:p-6 xl:p-10 xl:pb-8 space-y-6 sm:space-y-8 lg:space-y-6 xl:space-y-8">
        <div className="flex items-center space-x-4">
          <svg
            className="w-24 h-24 rounded-lg bg-slate-100"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            {playerState?.track_window.current_track ? (
              <image
                xlinkHref={playerState.track_window.current_track.album.images[0].url}
                x="0"
                y="0"
                height="100%"
                width="100%"
              />
            ) : (
              <image
                xlinkHref="https://tailwindcss.com/_next/static/media/full-stack-radio.afb14e4e.png"
                x="0"
                y="0"
                height="100%"
                width="100%"
              />
            )}
          </svg>
          <div className="min-w-0 flex-auto space-y-1 font-semibold">
            <h2 className="text-slate-500 transition-all duration-500 dark:text-slate-400 text-sm leading-6 truncate">
              {playerState?.track_window.current_track
                ? playerState.track_window?.current_track.artists[0].name
                : '-'}
            </h2>
            <p className="text-slate-900 transition-all duration-500 dark:text-slate-50 text-lg">
              {playerState?.track_window.current_track
                ? playerState.track_window?.current_track.name
                : '-'}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="relative">
            <input
              type="range"
              min={0}
              max={playerState?.duration}
              value={playingPosition}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>
          <div className="flex justify-between text-sm leading-6 font-medium tabular-nums">
            <div className="text-cyan-500 transition-all duration-500 dark:text-slate-100">
              {millisecondsToMinutesAndSeconds(playingPosition)}
            </div>
            <div className="text-slate-500 transition-all duration-500 dark:text-slate-400">
              {playerState?.duration
                ? millisecondsToMinutesAndSeconds(playerState.duration)
                : '0:00'}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-slate-50 text-slate-500 transition-all duration-500 dark:bg-slate-600 transition-all duration-500 dark:text-slate-200 rounded-b-xl flex items-center">
        <div className="flex-auto flex items-center justify-evenly">
          <button type="button" aria-label="Add to favorites">
            <svg width="24" height="24">
              <path
                d="M7 6.931C7 5.865 7.853 5 8.905 5h6.19C16.147 5 17 5.865 17 6.931V19l-5-4-5 4V6.931Z"
                fill="currentColor"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </button>
          <button
            type="button"
            className="hidden sm:block lg:hidden xl:block"
            aria-label="Previous"
          >
            <svg width="24" height="24" fill="none">
              <path
                d="m10 12 8-6v12l-8-6Z"
                fill="currentColor"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M6 6v12"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </button>
          <button type="button" aria-label="Rewind 10 seconds">
            <svg width="24" height="24" fill="none">
              <path
                d="M6.492 16.95c2.861 2.733 7.5 2.733 10.362 0 2.861-2.734 2.861-7.166 0-9.9-2.862-2.733-7.501-2.733-10.362 0A7.096 7.096 0 0 0 5.5 8.226"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M5 5v3.111c0 .491.398.889.889.889H9"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </button>
        </div>
        {playerState?.paused ? (
          <button
            type="button"
            className="bg-white text-slate-900 transition-all duration-500 dark:bg-slate-100 transition-all duration-500 dark:text-slate-700 flex-none -my-2 mx-auto w-20 h-20 rounded-full ring-1 ring-slate-900/5 shadow-md flex items-center justify-center"
            aria-label="play"
            onClick={() => {
              // スマートフォンではSDKが動作しないのでopen.spotify.comのリンクを開く
              const userAgent = window.navigator.userAgent.toLowerCase();
              if (
                userAgent.indexOf('iphone') != -1 ||
                userAgent.indexOf('ipad') != -1 ||
                userAgent.indexOf('android') != -1
              ) {
                window.open(`https://open.spotify.com/track/${track.id}`);
                return;
              }
              player?.togglePlay();
              countUpPlayingPosition();
            }}
          >
            <svg width="30" height="30" fill="currentColor">
              <path d="M5 0 L30 15 L5 30 Z"></path>
            </svg>
          </button>
        ) : (
          <button
            type="button"
            className="bg-white text-slate-900 transition-all duration-500 dark:bg-slate-100 transition-all duration-500 dark:text-slate-700 flex-none -my-2 mx-auto w-20 h-20 rounded-full ring-1 ring-slate-900/5 shadow-md flex items-center justify-center"
            aria-label="Pause"
            onClick={() => {
              player?.pause();
              pausePlayingPosition();
            }}
          >
            <svg width="30" height="32" fill="currentColor">
              <rect x="6" y="4" width="4" height="24" rx="2"></rect>
              <rect x="20" y="4" width="4" height="24" rx="2"></rect>
            </svg>
          </button>
        )}
        <div className="flex-auto flex items-center justify-evenly">
          <button type="button" aria-label="Skip 10 seconds" className="">
            <svg width="24" height="24" fill="none">
              <path
                d="M17.509 16.95c-2.862 2.733-7.501 2.733-10.363 0-2.861-2.734-2.861-7.166 0-9.9 2.862-2.733 7.501-2.733 10.363 0 .38.365.711.759.991 1.176"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M19 5v3.111c0 .491-.398.889-.889.889H15"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </button>
          <button type="button" className="hidden sm:block lg:hidden xl:block" aria-label="Next">
            <svg width="24" height="24" fill="none">
              <path
                d="M14 12 6 6v12l8-6Z"
                fill="currentColor"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M18 6v12"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </button>
          <button
            type="button"
            className="rounded-lg text-xs leading-6 font-semibold px-2 ring-2 ring-inset ring-slate-500 text-slate-500 transition-all duration-500 dark:text-slate-100 transition-all duration-500 dark:ring-0 transition-all duration-500 dark:bg-slate-500"
          >
            1x
          </button>
        </div>
      </div>
    </div>
  );
};
