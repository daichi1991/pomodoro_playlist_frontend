'use client';

import { MusicContext } from "@/app/context/musicContext";
import { useContext } from "react";

interface Props {
  open: boolean;
  title: string;
  declineButtonText: string;
  declineButtonOnClick: () => void;
  closeModalOnClick: () => void;
  selectPlaylistOnClick: (playlistId: string, playlistName: string) => void;
}

export const SelectPlaylistModal: React.FC<Props> = (props: Props) => {
  const { playlists } = useContext(MusicContext);
  
  const handleSelectPlaylistOnClick = (playlistId: string, playlistName: string) => {
    props.selectPlaylistOnClick(playlistId, playlistName);
    props.closeModalOnClick();
  }

  return (
    <>
    {props.open && (
    <div id="overlay" className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div id="default-modal" tabIndex={-1} aria-hidden="true" className="justify-center items-center">
        <div className="relative p-4 w-full max-w-2xl max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {props.title}
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="default-modal"
                onClick={() => props.closeModalOnClick()}
              >
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                  </svg>
                  <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-4 md:p-5 space-y-4">
              <ul>
                {playlists?.map((playlist: any) => (
                  <li
                    key={playlist.id}
                    onClick={
                      () => handleSelectPlaylistOnClick(playlist.id, playlist.name)
                    }
                    className="text-base leading-relaxed text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white"
                  >
                    {playlist.name}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button
                data-modal-hide="default-modal"
                type="button"
                className="ms-3 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                onClick={() => props.declineButtonOnClick!()}
              >
                {props.declineButtonText}
              </button>
              </div>
            </div>
        </div>
      </div>
    </div>
    )}
    </>

  )
}