import { Pomodoro } from '../types';
import { pomodorosUrl, requestHeader, userUrl } from '../utils/urls';
import { getSpotifyUserId } from './spotify';

export const fetchLogin = async () => {
  const response = await fetch(`${userUrl}/login`, {
    method: 'GET',
    headers: requestHeader,
  });
  if (response.status !== 200) {
    console.log('error');
    console.log('fetchLogin', response);
    return;
  }
  const res = await response.json();
  return res.login_url;
};

export const getTokens = async () => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    if (code && state) {
      const uri =
        `${userUrl}/get_tokens?code=` +
        encodeURIComponent(code) +
        '&state=' +
        encodeURIComponent(state);

      await fetch(uri, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json();
        })
        .then((data) => {
          if (data.access_token) {
            localStorage.setItem('access_token', data.access_token);
          }
          if (data.refresh_token) {
            localStorage.setItem('refresh_token', data.refresh_token);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
};

export const postRefreshToken = async () => {
  const response = await fetch(`${userUrl}/refresh_token`, {
    method: 'POST',
    headers: requestHeader,
    body: JSON.stringify({ refresh_token: localStorage.getItem('refresh_token') }),
  });
  if (response.status !== 200) {
    console.log('error');
    console.log('postRefreshToken', response);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return;
  }
  const res = await response.json();
  localStorage.setItem('access_token', res.data.access_token);
  console.log('postRefreshToken');
};

export const getPomodoros = async () => {
  const spotify_user_id = await getSpotifyUserId();
  if (!spotify_user_id) return;
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
