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

export const getOnePomodoro = async (id: string) => {
  const response = await fetch(`${pomodorosUrl}/${id}`, {
    method: 'GET',
    headers: requestHeader,
  });
  return response.json();
}

export const createPomodoro = async (pomodoro: Pomodoro) => {
  const response = await fetch(pomodorosUrl, {
    method: 'POST',
    headers: requestHeader,
    body: JSON.stringify(pomodoro),
  });
  return response.json();
};

export const updatePomodoro = async (pomodoro: Pomodoro) => {
  const response = await fetch(`${pomodorosUrl}/${pomodoro.id}`, {
    method: 'PUT',
    headers: requestHeader,
    body: JSON.stringify(pomodoro),
  });
  return response.json();
}

export const deletePomodoro = async (id: string) => {
  const response = await fetch(`${pomodorosUrl}/${id}`, {
    method: 'DELETE',
    headers: requestHeader,
  });
  return response.json();
}
