import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import AuthUserProvider from './context/authUserContext';
import MusicProvider from './context/musicContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'pomoplay',
  description: 'pomodoro timer with spotify',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthUserProvider>
      <MusicProvider>
        <html lang="en">
          <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <body className={inter.className}>{children}</body>
          </div>
        </html>
      </MusicProvider>
    </AuthUserProvider>
  );
}
