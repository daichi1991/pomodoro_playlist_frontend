'use client';

import { Pomodoro } from '@/app/types';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { createPomodoro, updatePomodoro } from '../../apis/pomodoro';
import { AuthUserContext } from '../../context/authUserContext';
import { MusicContext } from '../../context/musicContext';
import { SelectPlaylistModal } from '../PlaylistModal/Index';

interface Props{
  mode: string;
  pomodoro?: Pomodoro;
}

export const PomodoroForm: React.FC<Props> = (props: Props) => {
  const router = useRouter();
  const { playlists } = useContext(MusicContext);
  const { userId } = useContext(AuthUserContext);
  const [worktimePlaylist, setWorktimePlaylist] = useState({ id: '', name: '' });
  const [breaktimePlaylist, setBreaktimePlaylist] = useState({ id: '', name: '' });
  const [pomodoroName, setPomodoroName] = useState('');
  const [worktimeLength, setWorktimeLength] = useState(0);
  const [breaktimeLength, setBreaktimeLength] = useState(0);
  const [termCount, setTermCount] = useState(0);
  const [longBreaktimeLength, setLongBreaktimeLength] = useState(0);
  const [termRepeatCount, setTermRepeatCount] = useState(0);
  const [isErrorPomodoroName, setIsErrorPomodoroName] = useState(false);
  const [isErrorWorktimePlaylist, setIsErrorWorktimePlaylist] = useState(false);
  const [isErrorBreaktimePlaylist, setIsErrorBreaktimePlaylist] = useState(false);
  const [isErrorWorktimeLength, setIsErrorWorktimeLength] = useState(false);
  const [isErrorBreaktimeLength, setIsErrorBreaktimeLength] = useState(false);
  const [isErrorTermCount, setIsErrorTermCount] = useState(false);
  const [isErrorLongBreaktimeLength, setIsErrorLongBreaktimeLength] = useState(false);
  const [isErrorTermRepeatCount, setIsErrorTermRepeatCount] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isWorktimePlaylistModalOpen, setIsWorktimePlaylistModalOpen] = useState(false);
  const [isBreaktimePlaylistModalOpen, setIsBreaktimePlaylistModalOpen] = useState(false);

  const handleWorktimePlaylistModalOpen = () => {
    setIsWorktimePlaylistModalOpen(true);
  }

  const handleWorktimePlaylistModalClose = () => {
    setIsWorktimePlaylistModalOpen(false);
  }

  const handleBreaktimePlaylistModalOpen = () => {
    setIsBreaktimePlaylistModalOpen(true);
  }

  const handleBreaktimePlaylistModalClose = () => {
    setIsBreaktimePlaylistModalOpen(false);
  }

  const handleSetWorktimePlaylist = (playlistId: string, playlistName: string) => {
    setWorktimePlaylist({ id: playlistId, name: playlistName });
  };

  const handleSetBreaktimePlaylist = (playlistId: string, playlistName: string) => {
    setBreaktimePlaylist({ id: playlistId, name: playlistName });
  };

  const validateForm = () => {
    let isErrorCount = 0;
    if (pomodoroName === '') {
      setIsErrorPomodoroName(true);
      isErrorCount += 1;
    } else {
      setIsErrorPomodoroName(false);
    }
    if (worktimePlaylist.id === '') {
      setIsErrorWorktimePlaylist(true);
      isErrorCount += 1;
    } else {
      setIsErrorWorktimePlaylist(false);
    }
    if (breaktimePlaylist.id === '') {
      setIsErrorBreaktimePlaylist(true);
      isErrorCount += 1;
    } else {
      setIsErrorBreaktimePlaylist(false);
    }
    if (worktimeLength === 0) {
      setIsErrorWorktimeLength(true);
      isErrorCount += 1;
    } else {
      setIsErrorWorktimeLength(false);
    }
    if (breaktimeLength === 0) {
      setIsErrorBreaktimeLength(true);
      isErrorCount += 1;
    } else {
      setIsErrorBreaktimeLength(false);
    }
    if (termCount === 0) {
      setIsErrorTermCount(true);
      isErrorCount += 1;
    } else {
      setIsErrorTermCount(false);
    }
    if (longBreaktimeLength === 0) {
      setIsErrorLongBreaktimeLength(true);
      isErrorCount += 1;
    } else {
      setIsErrorLongBreaktimeLength(false);
    }
    if (termRepeatCount === 0) {
      setIsErrorTermRepeatCount(true);
      isErrorCount += 1;
    } else {
      setIsErrorTermRepeatCount(false);
    }
    if (isErrorCount > 0) {
      setIsError(true);
    } else {
      setIsError(false);
    }
  };

  const handleCreate = () => {
    validateForm();
    if (isError) {
      return;
    }
    const pomodoro = {
      spotify_user_id: userId,
      name: pomodoroName,
      work_time_playlist_id: worktimePlaylist.id,
      break_time_playlist_id: breaktimePlaylist.id,
      work_time: worktimeLength,
      break_time: breaktimeLength,
      term_count: termCount,
      long_break_time: longBreaktimeLength,
      term_repeat_count: termRepeatCount,
    };
    createPomodoro(pomodoro).then((res) => {
      router.push(`/play_pomodoro/${res.pomodoro.id}`);
    });
  };

  const handleUpdate = () => {
    validateForm();
    if (isError) {
      return;
    }
    const pomodoro = {
      spotify_user_id: userId,
      name: pomodoroName,
      work_time_playlist_id: worktimePlaylist.id,
      break_time_playlist_id: breaktimePlaylist.id,
      work_time: worktimeLength,
      break_time: breaktimeLength,
      term_count: termCount,
      long_break_time: longBreaktimeLength,
      term_repeat_count: termRepeatCount,
    };
    updatePomodoro(pomodoro).then((res: { pomodoro: Pomodoro; }) => {
      router.push(`/play_pomodoro/${res.pomodoro.id}`);
    });
  };

  useEffect(() => {
    console.log(props.pomodoro);
    if (props.pomodoro) {
      setPomodoroName(props.pomodoro.name);
      setWorktimePlaylist({ id: props.pomodoro.work_time_playlist_id, name: props.pomodoro.work_time_playlist_name! });
      setBreaktimePlaylist({ id: props.pomodoro.break_time_playlist_id, name: props.pomodoro.break_time_playlist_name! });
      setWorktimeLength(props.pomodoro.work_time);
      setBreaktimeLength(props.pomodoro.break_time);
      setTermCount(props.pomodoro.term_count);
      setLongBreaktimeLength(props.pomodoro.long_break_time);
      setTermRepeatCount(props.pomodoro.term_repeat_count);
    }
  }, [props.pomodoro]);

  return (
    <>
      <div id="create-pomodoro-form">
        <div id="pomodoro-name-form">
          <label htmlFor="pomodoro_name" className="block text-sm font-medium leading-6">
            ポモドーロ名
          </label>
          <div className="mt-2">
            {isErrorPomodoroName && (
              <div className="text-red-500 text-sm">ポモドーロ名を入力してください</div>
            )}
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
              <input
                type="text"
                name="pomodoro_name"
                id="pomodoro_name"
                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="ポモドーロ名"
                value={pomodoroName}
                onChange={(e) => setPomodoroName(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div id="worktime-playlist-form">
          <label htmlFor="worktime-playlist" className="block text-sm font-medium leading-6">
            作業中に再生するプレイリスト
          </label>
          <div className="mt-2">
            {isErrorWorktimePlaylist && (
              <div className="text-red-500 text-sm">プレイリストを選択してください</div>
            )}
            {worktimePlaylist?.name}
            <button
              type="button"
              className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={() => handleWorktimePlaylistModalOpen()}
            >
              選択
            </button>
          </div>
        </div>
        <div id="breaktime-playlist-form">
          <label htmlFor="breaktime-playlist" className="block text-sm font-medium leading-6">
            休憩中に再生するプレイリスト
          </label>
          <div className="mt-2">
            {isErrorBreaktimePlaylist && (
              <div className="text-red-500 text-sm">プレイリストを選択してください</div>
            )}
            {breaktimePlaylist?.name}
            <button
              type="button"
              className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={() => handleBreaktimePlaylistModalOpen()}
            >
              選択
            </button>
          </div>
        </div>
        <div id="worktime-length-form">
          <label htmlFor="worktime-length" className="block text-sm font-medium leading-6">
            作業時間
          </label>
          <div className="mt-2">
            {isErrorWorktimeLength && (
              <div className="text-red-500 text-sm">作業時間を入力してください</div>
            )}
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
              <input
                type="number"
                name="worktime-length"
                id="worktime-length"
                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                value={worktimeLength / 60 / 1000}
                onChange={(e) => setWorktimeLength(Number(e.target.value) * 60 * 1000)}
              />
              <span className="inline-flex items-center px-3 text-gray-500 text-sm">分</span>
            </div>
          </div>
        </div>
        <div id="breaktime-length-form">
          <label htmlFor="breaktime-length" className="block text-sm font-medium leading-6">
            休憩時間
          </label>
          <div className="mt-2">
            {isErrorBreaktimeLength && (
              <div className="text-red-500 text-sm">休憩時間を入力してください</div>
            )}
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
              <input
                type="number"
                name="breaktime-length"
                id="breaktime-length"
                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                value={breaktimeLength / 60 / 1000}
                onChange={(e) => setBreaktimeLength(Number(e.target.value) * 60 * 1000)}
              />
              <span className="inline-flex items-center px-3 text-gray-500 text-sm">分</span>
            </div>
          </div>
        </div>
        <div id="term-count-form">
          <label htmlFor="term-count" className="block text-sm font-medium leading-6">
            セット数
          </label>
          <div className="mt-2">
            {isErrorTermCount && (
              <div className="text-red-500 text-sm">セット数を入力してください</div>
            )}
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
              <input
                type="number"
                name="term-count"
                id="term-count"
                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                value={termCount}
                onChange={(e) => setTermCount(Number(e.target.value))}
              />
              <span className="inline-flex items-center px-3 text-gray-500 text-sm">回</span>
            </div>
          </div>
        </div>
        <div id="term-breaktime-length-form">
          <label htmlFor="term-breaktime-length" className="block text-sm font-medium leading-6">
            全セット終了時の休憩時間
          </label>
          <div className="mt-2">
            {isErrorLongBreaktimeLength && (
              <div className="text-red-500 text-sm">セット終了時の休憩時間を入力してください</div>
            )}
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
              <input
                type="number"
                name="term-breaktime-length"
                id="term-breaktime-length"
                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                value={longBreaktimeLength / 60 / 1000}
                onChange={(e) => setLongBreaktimeLength(Number(e.target.value) * 60 * 1000)}
              />
              <span className="inline-flex items-center px-3 text-gray-500 text-sm">分</span>
            </div>
          </div>
        </div>
        <div id="term_repeat_count-form">
          <label htmlFor="term_repeat_count" className="block text-sm font-medium leading-6">
            セットを繰り返す回数
          </label>
          <div className="mt-2">
            {isErrorTermRepeatCount && (
              <div className="text-red-500 text-sm">セットを繰り返す回数を入力してください</div>
            )}
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
              <input
                type="number"
                name="term_repeat_count"
                id="term_repeat_count"
                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                value={termRepeatCount}
                onChange={(e) => setTermRepeatCount(Number(e.target.value))}
              />
              <span className="inline-flex items-center px-3 text-gray-500 text-sm">回</span>
            </div>
          </div>
        </div>
        <div id="submit-button">
          {props.mode === 'create' ? (
            <button
              type="button"
              className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={() => handleCreate()}
            >
              作成
            </button>
          ) : (
            <button
              type="button"
              className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={() => handleUpdate()}
            >
              更新
            </button>
          )}
        </div>
      </div>
      <SelectPlaylistModal
        open={isWorktimePlaylistModalOpen}
        title={'作業中に再生するプレイリストを選択'}
        declineButtonText={'キャンセル'}
        declineButtonOnClick={() => handleWorktimePlaylistModalClose()}
        closeModalOnClick={() => handleWorktimePlaylistModalClose()}
        selectPlaylistOnClick={(playlistId: string, playlistName: string) => handleSetWorktimePlaylist(playlistId, playlistName)}
      />
      <SelectPlaylistModal
        open={isBreaktimePlaylistModalOpen}
        title={'休憩中に再生するプレイリストを選択'}
        declineButtonText={'キャンセル'}
        declineButtonOnClick={() => handleBreaktimePlaylistModalClose()}
        closeModalOnClick={() => handleBreaktimePlaylistModalClose()}
        selectPlaylistOnClick={(playlistId: string, playlistName: string) => handleSetBreaktimePlaylist(playlistId, playlistName)}
      />
    </>
  );
};
