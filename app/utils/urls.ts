// const mode = process.env.REACT_APP_MODE
// const HOST = 'http://localhost:3000';

const API_URL = process.env.NEXT_PUBLIC_API_URL

const DEFAULT_URL = `${API_URL}/api/v1`

export const requestHeader = {
  "Content-Type": "application/json",
}

export const pomodorosUrl = `${DEFAULT_URL}/pomodoros`
export const userUrl = `${DEFAULT_URL}/users`
