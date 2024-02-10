"use client"

import { useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { deletePomodoro, getPomodoros } from "../../apis/pomodoro"
import { getPlaylists } from "../../apis/spotify"
import { AuthUserContext } from "../../context/authUserContext"
import { Pomodoro, SpotifyPlaylistItems } from "../../types"
import { CreatePomodoroButton } from "../CreatePomodoroButton/Index"
import { Loading } from "../Loading/Index"
import { Modal } from "../Modal/Index"

export const PomodoroList = () => {
  const router = useRouter()
  const { userId } = useContext(AuthUserContext)
  const [pomodorosState, setPomodorosState] = useState<Pomodoro[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteTargetPomodoro, setDeleteTargetPomodoro] =
    useState<Pomodoro | null>(null)
  const [deletePomodoroCount, setDeletePomodoroCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const setPomodoroName = (
    pomodoro: Pomodoro,
    spotifyPlaylistItems: SpotifyPlaylistItems[]
  ) => {
    const workTimePlaylist = spotifyPlaylistItems.find(
      (playlist) => playlist.id === pomodoro.work_time_playlist_id
    )
    const breakTimePlaylist = spotifyPlaylistItems.find(
      (playlist) => playlist.id === pomodoro.break_time_playlist_id
    )
    pomodoro.work_time_playlist_name = workTimePlaylist?.name
    pomodoro.break_time_playlist_name = breakTimePlaylist?.name
  }

  const handleGoToPlayPomodoroPage = (pomodoro_id: string) => {
    if (!userId) return
    if (!pomodoro_id) return
    router.push(`/play_pomodoro/${pomodoro_id}`)
  }

  const handelGoToUpdatePomodoroPage = (pomodoro_id: string) => {
    if (!userId) return
    if (!pomodoro_id) return
    router.push(`/edit_pomodoro/${pomodoro_id}`)
  }

  const handleDeleteModalOpen = (pomodoro: Pomodoro) => {
    if (!pomodoro) return
    setDeleteTargetPomodoro(pomodoro)
    setIsModalOpen(true)
  }

  const handleDeletePomodoro = () => {
    if (!deleteTargetPomodoro?.id) return
    deletePomodoro(deleteTargetPomodoro.id)
    setIsModalOpen(false)
    setDeleteTargetPomodoro(null)
    setDeletePomodoroCount(deletePomodoroCount + 1)
  }

  const handleDeleteModalClose = () => {
    setIsModalOpen(false)
    setDeleteTargetPomodoro(null)
  }

  useEffect(() => {
    const handleGetPomodoros = async () => {
      const response = await getPomodoros()
      const pomodoros = response.pomodoros
      if (pomodoros.length === 0) {
        setPomodorosState([])
        setIsLoading(false)
        return
      }
      const spotifyPlaylists = await getPlaylists()
      pomodoros.forEach(async (pomodoro: Pomodoro) => {
        setPomodoroName(pomodoro, spotifyPlaylists)
      })
      setPomodorosState(pomodoros)
      setIsLoading(false)
    }
    handleGetPomodoros()
  }, [userId, deletePomodoroCount])

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : pomodorosState.length === 0 ? (
        <>
          <div className="text-xl my-10 text-center leading-10">
            まだポモドーロタイマーが作成されていません。
            <br />
          </div>
          <CreatePomodoroButton />
        </>
      ) : (
        <>
          <div className="flex w-full justify-end">
            <CreatePomodoroButton />
          </div>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    ポモドーロタイマー名
                  </th>
                  <th scope="col" className="px-6 py-3">
                    集中時のプレイリスト名
                  </th>
                  <th scope="col" className="px-6 py-3">
                    休憩時のプレイリスト名
                  </th>
                  <th scope="col" className="px-6 py-3">
                    集中
                  </th>
                  <th scope="col" className="px-6 py-3">
                    休憩
                  </th>
                  <th scope="col" className="px-6 py-3">
                    セット数
                  </th>
                  <th scope="col" className="px-6 py-3">
                    セット後の休憩
                  </th>
                  <th scope="col" className="px-6 py-3">
                    セット繰り返し
                  </th>
                  <th scope="col" className="px-6 py-3">
                    アクション
                  </th>
                </tr>
              </thead>
              <tbody>
                {pomodorosState.map((pomodoro) => (
                  <tr
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                    key={pomodoro.id}
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      onClick={() => handleGoToPlayPomodoroPage(pomodoro.id!)}
                    >
                      {pomodoro.name}
                    </th>
                    <td
                      className="px-6 py-4"
                      onClick={() => handleGoToPlayPomodoroPage(pomodoro.id!)}
                    >
                      {pomodoro.work_time_playlist_name}
                    </td>
                    <td
                      className="px-6 py-4"
                      onClick={() => handleGoToPlayPomodoroPage(pomodoro.id!)}
                    >
                      {pomodoro.break_time_playlist_name}
                    </td>
                    <td
                      className="px-6 py-4"
                      onClick={() => handleGoToPlayPomodoroPage(pomodoro.id!)}
                    >
                      {pomodoro.work_time / 60 / 1000}分
                    </td>
                    <td
                      className="px-6 py-4"
                      onClick={() => handleGoToPlayPomodoroPage(pomodoro.id!)}
                    >
                      {pomodoro.break_time / 60 / 1000}分
                    </td>
                    <td
                      className="px-6 py-4"
                      onClick={() => handleGoToPlayPomodoroPage(pomodoro.id!)}
                    >
                      {pomodoro.term_count}セット
                    </td>
                    <td
                      className="px-6 py-4"
                      onClick={() => handleGoToPlayPomodoroPage(pomodoro.id!)}
                    >
                      {pomodoro.long_break_time / 60 / 1000}分
                    </td>
                    <td
                      className="px-6 py-4"
                      onClick={() => handleGoToPlayPomodoroPage(pomodoro.id!)}
                    >
                      {pomodoro.term_repeat_count}回
                    </td>
                    <td className="flex items-center px-6 py-4">
                      <button
                        onClick={() =>
                          handelGoToUpdatePomodoroPage(pomodoro.id!)
                        }
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        編集
                      </button>
                      <button
                        onClick={() => handleDeleteModalOpen(pomodoro)}
                        className="font-medium text-red-600 dark:text-red-500 hover:underline ms-3"
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      <Modal
        open={isModalOpen}
        title="本当に削除しますか？"
        content="削除すると元に戻せません。"
        acceptButtonText="削除する"
        idDeclineButton={true}
        declineButtonText="キャンセル"
        acceptButtonOnClick={handleDeletePomodoro}
        declineButtonOnClick={handleDeleteModalClose}
        closeModalOnClick={handleDeleteModalClose}
      />
    </>
  )
}
function getUserProfile() {
  throw new Error("Function not implemented.")
}
