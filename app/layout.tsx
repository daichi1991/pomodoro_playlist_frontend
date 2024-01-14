import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from './components/Header/Index';
import AuthUserProvider from './context/authUserContext';
import MusicProvider from './context/musicContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'pomoplay',
  description: 'pomodoro timer with spotify',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthUserProvider>
      <MusicProvider>
        <html lang="ja">
          <body>
          <Header />
            <div className="flex min-h-full flex-col items-center justify-center px-6 py-6 lg:px-8">
              <div className="max-w-screen-2xl">
                <div className={inter.className}>{children}</div>
              </div>
            </div>
          </body>
        </html>
      </MusicProvider>
    </AuthUserProvider>
  );
}
