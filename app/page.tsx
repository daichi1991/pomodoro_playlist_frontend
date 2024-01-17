'use client';

import { fetchLogin, getTokens } from '@/app/apis/pomodoro';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SERVICE_NAME } from "./utils/constants";

export default function Home() {
  const router = useRouter();
  const pathname = usePathname()
  const [isLogin, setIsLogin] = useState(false);

  const handleSignin = async () => {
    await fetchLogin().then((url) => {
      router.push(url);
    });
  };

  const handleGotoDashboard = () => {
    router.push('/dashboard');
  };

  useEffect(() => {
    const handleGetTokens = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      if (!code || !state) {
        return;
      }
      await getTokens();
      router.push('/');
      setIsLogin(true);
    };
    handleGetTokens();
  }, []);

  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [isLogin]);

  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      setIsLogin(true);
    }
  }, [isLogin]);

  return (
    <>
      <div className="text-6xl font-bold flex items-center justify-center my-10">
        {SERVICE_NAME}
      </div>
      {!isLogin && (
        <>
          <div className="text-xl my-10 text-center leading-10">
            {SERVICE_NAME}は、集中して作業するためのタイマーを作成できるサービスです。<br />
            作業時間と休憩時間を自由に設定できます。<br />
            また作業時間と休憩時間には、ご自身のSpotifyプレイリストを設定して再生することができます。<br />
          </div>
          <div className="text-xl my-10 text-center leading-10">
            使用にはSpotifyのアカウントが必要です。<br />
            以下のボタンからSpotifyと連携してください。<br />
          </div>
          <div className="flex items-center justify-center">
            <button
              onClick={handleSignin}
              className="mr-4 rounded-md  px-8 py-4 text-xl font-semibold shadow-sm ring-1 bg-gray-800 ring-inset ring-gray-300 hover:bg-gray-500"
              role="menuitem"
              id="user-menu-item-0"
            >
              Spotifyと連携して始める
            </button>
          </div>
        </>
      )}
      {isLogin && (
        <>
          <div className="text-xl my-10 text-center leading-10">
            Spotifyと連携済みです。
          </div>
          <div className="flex items-center justify-center">
            <button
              onClick={handleGotoDashboard}
              className="mr-4 rounded-md  px-8 py-4 text-xl font-semibold shadow-sm ring-1 bg-gray-800 ring-inset ring-gray-300 hover:bg-gray-500"
              role="menuitem"
              id="user-menu-item-0"
            >
              ダッシュボードに進む
            </button>
          </div>
        </>
      )}
    </>
  )
}
