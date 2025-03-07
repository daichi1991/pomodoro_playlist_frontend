"use client"

import { fetchLogin } from "@/app/apis/pomodoro"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useContext } from "react"
import { AuthUserContext } from "./context/authUserContext"
import { SERVICE_NAME } from "./utils/constants"

export default function Home() {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthUserContext)
  const router = useRouter()
  const pathname = usePathname()
  // const [isLogin, setIsLogin] = useState(false);

  const handleSignin = async () => {
    await fetchLogin().then((url) => {
      router.push(url)
    })
  }

  const handleGotoDashboard = () => {
    router.push("/dashboard")
  }

  return (
    <>
      <div className="text-6xl font-bold flex items-center justify-center my-10 text-white light-text-shadow dark:dark-text-shadow">
        <Image
          src="/images/logo.png"
          alt="logo"
          width={100}
          height={100}
          className="mr-4"
        />
        {SERVICE_NAME}
      </div>
      {!isAuthenticated && (
        <>
          <div className="text-xl my-10 text-center leading-10">
            {SERVICE_NAME}
            は、集中して作業するためのポモドーロタイマーを作成できるサービスです。
            <br />
            作業時間と休憩時間を自由に設定できます。
            <br />
            また作業時間と休憩時間には、ご自身のSpotifyプレイリストを設定して再生することができます。
            <br />
          </div>
          <div className="text-xl my-10 text-center leading-10">
            ご使用にはSpotifyのプレミアムアカウントが必要です。
            <br />
            以下のボタンからSpotifyと連携してください。
            <br />
          </div>
          <div className="flex items-center justify-center">
            <button
              onClick={handleSignin}
              className="mr-4 rounded-md  px-8 py-4 text-xl font-semibold shadow-sm light-button dark:dark-button"
              role="menuitem"
              id="user-menu-item-0"
            >
              Spotifyと連携して始める
            </button>
          </div>
        </>
      )}
      {isAuthenticated && (
        <>
          <div className="text-xl my-10 text-center leading-10">
            Spotifyと連携済みです。
          </div>
          <div className="flex items-center justify-center">
            <button
              onClick={handleGotoDashboard}
              className="mr-4 rounded-md  px-8 py-4 text-xl font-semibold shadow-sm light-button dark:dark-button"
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
