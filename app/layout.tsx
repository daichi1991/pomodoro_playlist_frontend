import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Container } from "./components/Container/Index"
import { Header } from "./components/Header/Index"
import AuthUserProvider from "./context/authUserContext"
import MusicProvider from "./context/musicContext"
import "./globals.css"
import Favicon from "/public/images/favicon.ico"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "pomo-sync-sounds",
  description: "pomodoro timer with spotify",
  icons: [{ rel: "icon", url: Favicon.src }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthUserProvider>
      <MusicProvider>
        <html lang="ja">
          <body>
            <Header />
            <div className="flex min-h-full flex-col items-center justify-center px-6 py-6 lg:px-8">
              <div className="max-w-screen-2xl">
                <div className={inter.className}>
                  <Container>{children}</Container>
                </div>
              </div>
            </div>
          </body>
        </html>
      </MusicProvider>
    </AuthUserProvider>
  )
}
