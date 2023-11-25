'use client';

import { MusicContext } from '@/app/context/musicContext';
import { useContext, useState } from 'react';

export const CreatePomodoroForm: React.FC = () => {
  const { playlists } = useContext(MusicContext);
  const [worktimePlaylist, setWorktimePlaylist] = useState({ id: '', name: '' });
  const [resttimePlaylist, setResttimePlaylist] = useState({ id: '', name: '' });
  const [pomodoroName, setPomodoroName] = useState('');
  const [worktimeLength, setWorktimeLength] = useState(0);
  const [resttimeLength, setResttimeLength] = useState(0);
  const [termCount, setTermCount] = useState(0);
  const [termResttimeLength, setTermResttimeLength] = useState(0);
  const [isErrorPomodoroName, setIsErrorPomodoroName] = useState(false);
  const [isErrorWorktimePlaylist, setIsErrorWorktimePlaylist] = useState(false);
  const [isErrorResttimePlaylist, setIsErrorResttimePlaylist] = useState(false);
  const [isErrorWorktimeLength, setIsErrorWorktimeLength] = useState(false);
  const [isErrorResttimeLength, setIsErrorResttimeLength] = useState(false);
  const [isErrorTermCount, setIsErrorTermCount] = useState(false);
  const [isErrorTermResttimeLength, setIsErrorTermResttimeLength] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSetWorktimePlaylist = (playlistId: string, playlistName: string) => {
    setWorktimePlaylist({ id: playlistId, name: playlistName });
  };

  const handleSetResttimePlaylist = (playlistId: string, playlistName: string) => {
    setResttimePlaylist({ id: playlistId, name: playlistName });
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
    if (resttimePlaylist.id === '') {
      setIsErrorResttimePlaylist(true);
      isErrorCount += 1;
    } else {
      setIsErrorResttimePlaylist(false);
    }
    if (worktimeLength === 0) {
      setIsErrorWorktimeLength(true);
      isErrorCount += 1;
    } else {
      setIsErrorWorktimeLength(false);
    }
    if (resttimeLength === 0) {
      setIsErrorResttimeLength(true);
      isErrorCount += 1;
    } else {
      setIsErrorResttimeLength(false);
    }
    if (termCount === 0) {
      setIsErrorTermCount(true);
      isErrorCount += 1;
    } else {
      setIsErrorTermCount(false);
    }
    if (termResttimeLength === 0) {
      setIsErrorTermResttimeLength(true);
      isErrorCount += 1;
    } else {
      setIsErrorTermResttimeLength(false);
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
        <div id="resttime-playlist-form">
          <label htmlFor="resttime-playlist" className="block text-sm font-medium leading-6">
            休憩中に再生するプレイリスト
          </label>
          <div className="mt-2">
            {isErrorResttimePlaylist && (
              <div className="text-red-500 text-sm">プレイリストを選択してください</div>
            )}
            {resttimePlaylist?.name}
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
        <div id="resttime-length-form">
          <label htmlFor="resttime-length" className="block text-sm font-medium leading-6">
            休憩時間
          </label>
          <div className="mt-2">
            {isErrorResttimeLength && (
              <div className="text-red-500 text-sm">休憩時間を入力してください</div>
            )}
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
              <input
                type="number"
                name="resttime-length"
                id="resttime-length"
                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                value={resttimeLength}
                onChange={(e) => setResttimeLength(Number(e.target.value))}
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
        <div id="term-resttime-length-form">
          <label htmlFor="term-resttime-length" className="block text-sm font-medium leading-6">
            セット終了時の休憩時間
          </label>
          <div className="mt-2">
            {isErrorTermResttimeLength && (
              <div className="text-red-500 text-sm">セット終了時の休憩時間を入力してください</div>
            )}
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
              <input
                type="number"
                name="term-resttime-length"
                id="term-resttime-length"
                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                value={termResttimeLength}
                onChange={(e) => setTermResttimeLength(Number(e.target.value))}
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
      <div id="select-resttime-playlist">
        <div id="select-worktime-playlist-header">
          <h2>休憩中に再生するプレイリストを選択</h2>
        </div>
        <div id="select-worktime-playlist-body">
          <ul>
            {playlists?.map((playlist: any) => (
              <li
                key={playlist.id}
                onClick={() => handleSetResttimePlaylist(playlist.id, playlist.name)}
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
