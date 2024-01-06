export const startPlaylist = async (playlist_id: string) => {
  await shuffleMode();
  const context_uri = `spotify:playlist:${playlist_id}`;
  const requestHeader = {
    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
    'Content-Type': 'application/json',
  };
  await fetch('https://api.spotify.com/v1/me/player/play', {
    method: 'PUT',
    headers: requestHeader,
    body: JSON.stringify({ context_uri, position_ms: 0 }),
  });
}

export const shuffleMode = async () => {
  const requestHeader = {
    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
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
  const requestHeader = {
    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
    'Content-Type': 'application/json',
  };
  await fetch('https://api.spotify.com/v1/me/player/play', {
    method: 'PUT',
    headers: requestHeader,
  });
}