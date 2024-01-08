export const startPlaylist = async (playlist_id: string) => {
  console.log(playlist_id);
  if (!playlist_id) return;
  const access_token = localStorage.getItem('access_token');
  if (!access_token) return;
  console.log('startPlaylist');
  await shuffleMode();
  const context_uri = `spotify:playlist:${playlist_id}`;
  const requestHeader = {
    'Authorization': 'Bearer ' + access_token,
    'Content-Type': 'application/json',
  };
  await fetch('https://api.spotify.com/v1/me/player/play', {
    method: 'PUT',
    headers: requestHeader,
    body: JSON.stringify({ context_uri, position_ms: 0 }),
  });
}

export const shuffleMode = async () => {
  const access_token = localStorage.getItem('access_token');
  if (!access_token) return;
  const requestHeader = {
    'Authorization': 'Bearer ' + access_token,
    'Content-Type': 'application/json',
  };
  await fetch('https://api.spotify.com/v1/me/player/shuffle?state=true', {
    method: 'PUT',
    headers: requestHeader,
  });
}

export const pausePlayback = async () => {
  const requestHeader = {
    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
    'Content-Type': 'application/json',
  };
  await fetch('https://api.spotify.com/v1/me/player/pause', {
    method: 'PUT',
    headers: requestHeader,
  });
}

export const resumePlayback = async () => {
  const access_token = localStorage.getItem('access_token');
  if (!access_token) return;
  console.log('resumePlayback');
  const requestHeader = {
    'Authorization': 'Bearer ' + access_token,
    'Content-Type': 'application/json',
  };
  await fetch('https://api.spotify.com/v1/me/player/play', {
    method: 'PUT',
    headers: requestHeader,
  });
}

export const getPlaylists = async () => {
  console.log('getPlaylists');
  const access_token = localStorage.getItem('access_token');
  if (!access_token) return;
  const requestHeader = {
    'Authorization': 'Bearer ' + access_token,
    'Content-Type': 'application/json',
  };
  const response = await fetch('https://api.spotify.com/v1/me/playlists', {
    method: 'GET',
    headers: requestHeader,
  });
  const data = await response.json();
  console.log(data);
  return data.items;
}