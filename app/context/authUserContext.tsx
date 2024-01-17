'use client';

import React, { createContext, useEffect, useState } from 'react';

interface AuthUserType {
  // ログインしているかどうか
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  // 削除しても良い
  handleAuthenticate: () => void;
  userId: string;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
  userImage: string;
  setUserImage: React.Dispatch<React.SetStateAction<string>>;
  getUserProfile: () => Promise<void>;
  deviceId: string;
  setDeviceId: React.Dispatch<React.SetStateAction<string>>;
  getDeviceId: () => void;
}

export const AuthUserContext = createContext<AuthUserType>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  handleAuthenticate: () => {},
  userId: '',
  setUserId: () => {},
  userImage: '',
  setUserImage: () => {},
  getUserProfile: () => Promise.resolve(),
  deviceId: '',
  setDeviceId: () => {},
  getDeviceId: () => {},
});

interface AuthUserProviderProps {
  children: React.ReactNode;
}

export const AuthUserProvider = ({ children }: AuthUserProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState('');
  const [userImage, setUserImage] = useState('');
  const [deviceId, setDeviceId] = useState('');

  const handleAuthenticate = () => {
    const access_token = localStorage.getItem('access_token');
    if (access_token) {
      getUserProfile().then(() => {
        if (userImage !== '') {
          setIsAuthenticated(true);
          return;
        }
      });
    }
    setIsAuthenticated(false);
    setUserImage('');
  };

  const getUserProfile = async () => {
    if (!localStorage.getItem('access_token')) {
      return;
    }
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    const data = await response.json();
    setUserId(data.id);
    setUserImage(data.images[0].url);
  };

  const getDeviceId = async () => {
    const access_token = localStorage.getItem('access_token');
    if (access_token) {
      const response = await fetch('https://api.spotify.com/v1/me/player/devices', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      const data = await response.json();
      setDeviceId(data.devices[0].id);
    }
  };

  useEffect(() => {
    handleAuthenticate();
  }, []);

  return (
    <AuthUserContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        handleAuthenticate,
        userId,
        setUserId,
        userImage,
        setUserImage,
        getUserProfile,
        deviceId,
        setDeviceId,
        getDeviceId,
      }}
    >
      {children}
    </AuthUserContext.Provider>
  );
};

export default AuthUserProvider;
