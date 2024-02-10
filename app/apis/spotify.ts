import { SpotifyPlaylistItems } from "../types"
import { postRefreshToken } from "./pomodoro"

export const transferPlayback = async (
  device_id: string,
  retry: boolean = false
): Promise<void> => {
  const access_token = localStorage.getItem("access_token")
  if (!access_token) return
  const requestHeader = {
    Authorization: "Bearer " + access_token,
    "Content-Type": "application/json",
  }
  const response = await fetch("https://api.spotify.com/v1/me/player", {
    method: "PUT",
    headers: requestHeader,
    body: JSON.stringify({ device_ids: [device_id], play: false }),
  })
  if (response.status !== 202) {
    if (!retry) {
      await postRefreshToken()
      return await transferPlayback(device_id, true)
    }
  }
}

export const startPlaylist = async (
  playlist_id: string,
  retry: boolean = false
): Promise<void> => {
  if (!playlist_id) return
  const access_token = localStorage.getItem("access_token")
  if (!access_token) return
  await shuffleMode()
  const context_uri = `spotify:playlist:${playlist_id}`
  const requestHeader = {
    Authorization: "Bearer " + access_token,
    "Content-Type": "application/json",
  }
  const response = await fetch("https://api.spotify.com/v1/me/player/play", {
    method: "PUT",
    headers: requestHeader,
    body: JSON.stringify({ context_uri, position_ms: 0 }),
  })
  if (response.status !== 202) {
    if (!retry) {
      await postRefreshToken()
      return await startPlaylist(playlist_id, true)
    }
  }
}

export const pausePlayback = async (retry: boolean = false): Promise<void> => {
  const requestHeader = {
    Authorization: "Bearer " + localStorage.getItem("access_token"),
    "Content-Type": "application/json",
  }
  const response = await fetch("https://api.spotify.com/v1/me/player/pause", {
    method: "PUT",
    headers: requestHeader,
  })
  if (response.status !== 202) {
    if (!retry) {
      await postRefreshToken()
      return await pausePlayback(true)
    }
  }
}

export const resumePlayback = async (retry: boolean = false): Promise<void> => {
  const access_token = localStorage.getItem("access_token")
  if (!access_token) return
  const requestHeader = {
    Authorization: "Bearer " + access_token,
    "Content-Type": "application/json",
  }
  const response = await fetch("https://api.spotify.com/v1/me/player/play", {
    method: "PUT",
    headers: requestHeader,
  })
  if (response.status !== 202) {
    if (!retry) {
      await postRefreshToken()
      return await resumePlayback(true)
    }
  }
}

export const getPlaylists = async (
  retry: boolean = false
): Promise<SpotifyPlaylistItems[] | []> => {
  const access_token = localStorage.getItem("access_token")
  if (!access_token) return []
  const requestHeader = {
    Authorization: "Bearer " + access_token,
    "Content-Type": "application/json",
  }
  const response = await fetch(
    "https://api.spotify.com/v1/me/playlists?limit=50",
    {
      method: "GET",
      headers: requestHeader,
    }
  )
  if (response.status !== 200) {
    if (!retry) {
      await postRefreshToken()
      return await getPlaylists(true)
    }
  }
  const data = await response.json()
  return data.items
}

export const shuffleMode = async (retry: boolean = false): Promise<void> => {
  const access_token = localStorage.getItem("access_token")
  if (!access_token) return
  const requestHeader = {
    Authorization: "Bearer " + access_token,
    "Content-Type": "application/json",
  }
  const response = await fetch(
    "https://api.spotify.com/v1/me/player/shuffle?state=true",
    {
      method: "PUT",
      headers: requestHeader,
    }
  )
  if (response.status !== 204) {
    if (!retry) {
      await postRefreshToken()
      return await shuffleMode(true)
    }
  }
}

export const getSpotifyUserId = async (
  retry: boolean = false
): Promise<string | null> => {
  const access_token = localStorage.getItem("access_token")
  if (!access_token) return null
  const requestHeader = {
    Authorization: "Bearer " + access_token,
    "Content-Type": "application/json",
  }
  const response = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: requestHeader,
  })
  const data = await response.json()
  if (response.status !== 200) {
    if (!retry) {
      await postRefreshToken()
      return await getSpotifyUserId(true)
    }
  }
  return data.id
}
