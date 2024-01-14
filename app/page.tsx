'use client';

import { postRefreshToken } from "./apis/pomodoro";

export default function Home() {

  const handlePostRefreshToken = async () => {
    await postRefreshToken();
  }

  return (
    <>
      <h1>Home</h1>
      <button
        onClick={handlePostRefreshToken}
      >
        refresh token
      </button>
    </>
  )
}
