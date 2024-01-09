'use client';

import { getOnePomodoro } from '@/app/apis/pomodoro';
import { PlayPomodoroConsole } from '@/app/components/PlayPomodoroConsole/Index';
import { Pomodoro } from '@/app/types';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from '../../components/Header/Index';

export default function PlayPomodoro() {
  const params = useParams<{slug: string}>();
  const [pomodoro, setPomodoro] = useState<Pomodoro>({
    id: '',
    spotify_userId: '',
    name: '',
    work_time_playlist_id: '',
    work_time_playlist_name: '',
    break_time_playlist_id: '',
    break_time_playlist_name: '',
    work_time: 0,
    break_time: 0,
    term_count: 0,
    long_break_time: 0,
    term_repeat_count: 0,
  });

  const handleGetPomodoro = async () => {
    const pomodoro_id = params.slug;
    if (!pomodoro_id) return;
    getOnePomodoro(pomodoro_id).then((response) => {
      setPomodoro(response.pomodoro);
    });
  };

  useEffect(() => {
    handleGetPomodoro();
  } , []);

  return (
    <div>
      <Header />
      <PlayPomodoroConsole pomodoro={pomodoro}/>
    </div>
  );
}
