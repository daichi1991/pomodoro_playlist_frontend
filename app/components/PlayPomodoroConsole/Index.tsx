import { Pomodoro, SpotifyPlaylistItems } from "@/app/types";
import { useEffect, useState } from "react";
import { getPlaylists } from "../../apis/spotify";
import { PlayPomodoroModal } from "../PlayPomodoroModal/Index";

interface Props {
  pomodoro: Pomodoro;
}

export const PlayPomodoroConsole: React.FC<Props> = (props: Props) => {
  const pomodoro = props.pomodoro;
  const [pomodoroState, setPomodoroState] = useState<Pomodoro>(pomodoro);
  const [pomodoroElementsState, setPomodoroElementsState] = useState<{ mode: string, playlist_id: string, time: number, term: number, term_repeat: number }[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const getSpotifyPlaylist = (playlist_id: string, spotifyPlaylistItems: SpotifyPlaylistItems[]) => {
    const playlist = spotifyPlaylistItems.find((playlist) => playlist.id === playlist_id);
    return playlist
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  useEffect(() => {
    // ポモドーロ情報の取得
    const handleGetPomodoro = async () => {
      if (pomodoroElementsState.length > 0) return;
      const spoitifyPlaylists = await getPlaylists();
      const work_time_playlist = getSpotifyPlaylist(pomodoro.work_time_playlist_id, spoitifyPlaylists);
      const break_time_playlist = getSpotifyPlaylist(pomodoro.break_time_playlist_id, spoitifyPlaylists);
      pomodoro.work_time_playlist_name = work_time_playlist!.name;
      pomodoro.work_time_playlist_image = work_time_playlist!.images[0].url;
      pomodoro.break_time_playlist_name = break_time_playlist!.name;
      pomodoro.break_time_playlist_image = break_time_playlist!.images[0].url;
      setPomodoroState(pomodoro);
      const pomodoroElements = [];
      for (let i = 0; i < pomodoro.term_repeat_count; i++) {
        for (let j = 0; j < pomodoro.term_count; j++) {
          pomodoroElements.push({ mode:'work', playlist_id: pomodoro.work_time_playlist_id, time: pomodoro.work_time, term: j + 1, term_repeat: i + 1 });
          if (j !== pomodoro.term_count - 1) {
            pomodoroElements.push({ mode:'break', playlist_id: pomodoro.break_time_playlist_id, time: pomodoro.break_time, term: j + 1, term_repeat: i + 1 });
          } else {
            pomodoroElements.push({ mode:'long_break', playlist_id: pomodoro.break_time_playlist_id, time: pomodoro.long_break_time, term: j + 1, term_repeat: i + 1 });
          }
        }
      }
      setPomodoroElementsState(pomodoroElements);
    };
    handleGetPomodoro();
  }, [pomodoro, pomodoroElementsState]);

  return (
    <div className="flex-row items-center justify-center">
      <div className="flex items-center justify-center">
        <button
          className="my-8 w-1/2 h-20 text-2xl border rounded-xl border-gray-500 border-solid hover:bg-gray-500"
          onClick={() => setIsModalOpen(true)}>
          ポモドーロを始める
        </button>
      </div>
      <div className="flex items-center justify-center">
        <div className="flex flex-col">
          <div>
            <svg
              className="w-60 h-60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <image xlinkHref={pomodoro.work_time_playlist_image!} x="0" y="0" height="100%" width="100%" />
            </svg>
          </div>
          <div>
            <div className="my-4 text-xl">{pomodoro.work_time_playlist_name}</div>
            <div className="mt-4 text-2xl">集中時間： {pomodoro.work_time / 60 / 1000} 分</div>
          </div>
        </div>
        <div className="mx-8 bg-gray-500 w-px h-auto"></div>
        <div className="flex flex-col">
          <div>
            <svg
              className="w-60 h-60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <image xlinkHref={pomodoro.break_time_playlist_image!} x="0" y="0" height="100%" width="100%" />
            </svg>
          </div>
          <div>
            <div className="my-4 text-xl">{pomodoro.break_time_playlist_name}</div>
            <div className="mt-4 text-2xl">休憩時間： {pomodoro.break_time / 60 / 1000} 分</div>
          </div>
        </div>
      </div>
      <div className="w-full ">
        <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
        <div className="my-4 text-2xl">
          セット数： {pomodoro.term_count}
        </div>
        <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
        <div className="my-4 text-2xl">
          全セット終了後の休憩時間： {pomodoro.long_break_time / 60 / 1000} 分
        </div>
        <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
        <div className="my-4 text-2xl">
          セットを繰り返す回数： {pomodoro.term_repeat_count}
        </div>
      </div>
      <PlayPomodoroModal
        open={isModalOpen}
        pomodoro={pomodoro}
        closeModalOnClick={handleCloseModal}
      />
    </div>
  );
};
