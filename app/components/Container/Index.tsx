'use client';

import { authCheck } from "@/app/hooks/useAuth";
import { useEffect } from "react";


export const Container = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const checkAuth = async () => {
      const tokenExist = await authCheck();
      if (!tokenExist && window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    checkAuth();
  }, []);
  
  return (
    <>
      {children}
    </>
  )
}