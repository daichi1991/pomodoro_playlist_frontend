import { Pomodoro } from '../types';
import { pomodorosUrl, requestHeader } from '../utils/urls';

export const getPomodoros = async (spotify_user_id: string) => {
  const requestHeader = {
    'Content-Type': 'application/json',
    'Pomodoro-Authorization': spotify_user_id,
  };
  const response = await fetch(pomodorosUrl, {
    method: 'GET',
    headers: requestHeader,
  });
  return response.json();
};

export const createPomodoro = async (pomodoro: Pomodoro) => {
  const response = await fetch(pomodorosUrl, {
    method: 'POST',
    headers: requestHeader,
    body: JSON.stringify(pomodoro),
  });
  return response.json();
};
