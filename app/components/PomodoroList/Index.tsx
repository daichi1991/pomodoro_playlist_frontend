'use client';

import { useContext, useEffect, useState } from 'react';
import { getPomodoros } from '../../apis/pomodoro';
import { AuthUserContext } from '../../context/authUserContext';
import { Pomodoro } from '../../types';

export const PomodoroList = () => {
  const { userId } = useContext(AuthUserContext);
  const [pomodoros, setPomodoros] = useState<Pomodoro[]>([]);

  const handleGetPomodoros = async () => {
    if (!userId) return;
    getPomodoros(userId).then((response) => {
      response.pomodoros.forEach(async (pomodoro: Pomodoro) => {
        pomodoro.work_time_playlist_name = await getPomodoroPlaylistName(
          pomodoro.work_time_playlist_id
        );
        pomodoro.break_time_playlist_name = await getPomodoroPlaylistName(
          pomodoro.break_time_playlist_id
        );
      });
      setPomodoros(response.pomodoros);
    });
  };

  const getPomodoroPlaylistName = async (playlistId: string) => {
    if (!userId) return;
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    const data = await response.json();
    return data.name;
  };

  useEffect(() => {
    handleGetPomodoros();
  }, [userId]);

  return (
    <>
      <h1>Pomodoro List</h1>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                ポモドーロ名
              </th>
              <th scope="col" className="px-6 py-3">
                集中時のプレイリスト名
              </th>
              <th scope="col" className="px-6 py-3">
                休憩時のプレイリスト名
              </th>
              <th scope="col" className="px-6 py-3">
                集中する時間
              </th>
              <th scope="col" className="px-6 py-3">
                休憩する時間
              </th>
              <th scope="col" className="px-6 py-3">
                セット数
              </th>
              <th scope="col" className="px-6 py-3">
                セット終了後の休憩時間
              </th>
              <th scope="col" className="px-6 py-3">
                アクション
              </th>
            </tr>
          </thead>
          <tbody>
            {pomodoros.map((pomodoro) => (
              <>
                <tr
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  key={pomodoro.id}
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {pomodoro.name}
                  </th>
                  <td className="px-6 py-4">{pomodoro.work_time_playlist_name}</td>
                  <td className="px-6 py-4">{pomodoro.break_time_playlist_name}</td>
                  <td className="px-6 py-4">{pomodoro.work_time}分</td>
                  <td className="px-6 py-4">{pomodoro.break_time}分</td>
                  <td className="px-6 py-4">{pomodoro.term_count}セット</td>
                  <td className="px-6 py-4">{pomodoro.long_break_time}分</td>
                  <td className="flex items-center px-6 py-4">
                    <a
                      href="#"
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      編集
                    </a>
                    <a
                      href="#"
                      className="font-medium text-red-600 dark:text-red-500 hover:underline ms-3"
                    >
                      削除
                    </a>
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
