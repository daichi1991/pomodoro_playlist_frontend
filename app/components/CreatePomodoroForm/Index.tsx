'use client';

import { useContext, useState } from 'react';
import { createPomodoro } from '../../apis/pomodoro';
import { AuthUserContext } from '../../context/authUserContext';
import { MusicContext } from '../../context/musicContext';

export const CreatePomodoroForm: React.FC = () => {
  const { playlists } = useContext(MusicContext);
  const { userId } = useContext(AuthUserContext);
  const [worktimePlaylist, setWorktimePlaylist] = useState({ id: '', name: '' });
  const [breaktimePlaylist, setBreaktimePlaylist] = useState({ id: '', name: '' });
  const [pomodoroName, setPomodoroName] = useState('');
  const [worktimeLength, setWorktimeLength] = useState(0);
  const [breaktimeLength, setBreaktimeLength] = useState(0);
  const [termCount, setTermCount] = useState(0);
  const [longBreaktimeLength, setLongBreaktimeLength] = useState(0);
  const [isErrorPomodoroName, setIsErrorPomodoroName] = useState(false);
  const [isErrorWorktimePlaylist, setIsErrorWorktimePlaylist] = useState(false);
  const [isErrorBreaktimePlaylist, setIsErrorBreaktimePlaylist] = useState(false);
  const [isErrorWorktimeLength, setIsErrorWorktimeLength] = useState(false);
  const [isErrorBreaktimeLength, setIsErrorBreaktimeLength] = useState(false);
  const [isErrorTermCount, setIsErrorTermCount] = useState(false);
  const [isErrorLongBreaktimeLength, setIsErrorLongBreaktimeLength] = useState(false);
  const [isError, setIsError] = useState(false);

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
    if (isErrorCount > 0) {
      setIsError(true);
    } else {
      setIsError(false);
    }
  };

  const handleSubmit = () => {
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
    };
    createPomodoro(pomodoro).then((res) => {
      console.log(res);
    });
  };

  return (
    <>
      <div>
        <h1>Create Pomodoro Form</h1>
      </div>
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
                value={worktimeLength}
                onChange={(e) => setWorktimeLength(Number(e.target.value))}
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
                value={breaktimeLength}
                onChange={(e) => setBreaktimeLength(Number(e.target.value))}
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
            セット終了時の休憩時間
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
                value={longBreaktimeLength}
                onChange={(e) => setLongBreaktimeLength(Number(e.target.value))}
              />
              <span className="inline-flex items-center px-3 text-gray-500 text-sm">分</span>
            </div>
          </div>
        </div>
        <div id="submit-button">
          <button
            type="button"
            className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={() => handleSubmit()}
          >
            作成
          </button>
        </div>
      </div>
      <div id="select-worktime-playlist">
        <div id="select-worktime-playlist-header">
          <h2>作業中に再生するプレイリストを選択</h2>
        </div>
        <div id="select-worktime-playlist-body">
          <ul>
            {playlists?.map((playlist: any) => (
              <li
                key={playlist.id}
                onClick={() => handleSetWorktimePlaylist(playlist.id, playlist.name)}
              >
                {playlist.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div id="select-breaktime-playlist">
        <div id="select-worktime-playlist-header">
          <h2>休憩中に再生するプレイリストを選択</h2>
        </div>
        <div id="select-worktime-playlist-body">
          <ul>
            {playlists?.map((playlist: any) => (
              <li
                key={playlist.id}
                onClick={() => handleSetBreaktimePlaylist(playlist.id, playlist.name)}
              >
                {playlist.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
