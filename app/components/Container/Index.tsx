'use client';

import { authCheck } from '@/app/hooks/useAuth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from "react";


export const Container = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname()
  
  useEffect(() => {
    const checkAuth = async () => {
      const tokenExist = await authCheck();
      if (!tokenExist && pathname !== '/') {
        router.push('/');
      }
    }
    checkAuth();
  }, [pathname, router]);
  
  return (
    <>
      {children}
    </>
  )
}