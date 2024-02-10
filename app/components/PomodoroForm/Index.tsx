"use client"

import { Pomodoro } from "@/app/types"
import { useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { createPomodoro, updatePomodoro } from "../../apis/pomodoro"
import { AuthUserContext } from "../../context/authUserContext"
import { MusicContext } from "../../context/musicContext"
import { SelectPlaylistModal } from "../SelectPlaylistModal/Index"
import { TimeAllocationBar } from "../TimeAllocationBar/Index"

interface Props {
  mode: string
  pomodoro?: Pomodoro
}

export const PomodoroForm: React.FC<Props> = (props: Props) => {
  const router = useRouter()
  const { playlists } = useContext(MusicContext)
  const { userId } = useContext(AuthUserContext)
  const [worktimePlaylist, setWorktimePlaylist] = useState({ id: "", name: "" })
  const [breaktimePlaylist, setBreaktimePlaylist] = useState({
    id: "",
    name: "",
  })
  const [pomodoroName, setPomodoroName] = useState("")
  const [worktimeLength, setWorktimeLength] = useState(0)
  const [breaktimeLength, setBreaktimeLength] = useState(0)
  const [termCount, setTermCount] = useState(0)
  const [longBreaktimeLength, setLongBreaktimeLength] = useState(0)
  const [termRepeatCount, setTermRepeatCount] = useState(0)
  const [isErrorPomodoroName, setIsErrorPomodoroName] = useState(false)
  const [isErrorWorktimePlaylist, setIsErrorWorktimePlaylist] = useState(false)
  const [isErrorBreaktimePlaylist, setIsErrorBreaktimePlaylist] =
    useState(false)
  const [isErrorWorktimeLength, setIsErrorWorktimeLength] = useState(false)
  const [isErrorBreaktimeLength, setIsErrorBreaktimeLength] = useState(false)
  const [isErrorTermCount, setIsErrorTermCount] = useState(false)
  const [isErrorLongBreaktimeLength, setIsErrorLongBreaktimeLength] =
    useState(false)
  const [isErrorTermRepeatCount, setIsErrorTermRepeatCount] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isWorktimePlaylistModalOpen, setIsWorktimePlaylistModalOpen] =
    useState(false)
  const [isBreaktimePlaylistModalOpen, setIsBreaktimePlaylistModalOpen] =
    useState(false)

  const handleWorktimePlaylistModalOpen = () => {
    setIsWorktimePlaylistModalOpen(true)
  }

  const handleWorktimePlaylistModalClose = () => {
    setIsWorktimePlaylistModalOpen(false)
  }

  const handleBreaktimePlaylistModalOpen = () => {
    setIsBreaktimePlaylistModalOpen(true)
  }

  const handleBreaktimePlaylistModalClose = () => {
    setIsBreaktimePlaylistModalOpen(false)
  }

  const handleSetWorktimePlaylist = (
    playlistId: string,
    playlistName: string
  ) => {
    setWorktimePlaylist({ id: playlistId, name: playlistName })
  }

  const handleSetBreaktimePlaylist = (
    playlistId: string,
    playlistName: string
  ) => {
    setBreaktimePlaylist({ id: playlistId, name: playlistName })
  }

  const validateForm = () => {
    let isErrorCount = 0
    if (pomodoroName === "") {
      setIsErrorPomodoroName(true)
      isErrorCount += 1
    } else {
      setIsErrorPomodoroName(false)
    }
    if (worktimePlaylist.id === "") {
      setIsErrorWorktimePlaylist(true)
      isErrorCount += 1
    } else {
      setIsErrorWorktimePlaylist(false)
    }
    if (breaktimePlaylist.id === "") {
      setIsErrorBreaktimePlaylist(true)
      isErrorCount += 1
    } else {
      setIsErrorBreaktimePlaylist(false)
    }
    if (worktimeLength === 0) {
      setIsErrorWorktimeLength(true)
      isErrorCount += 1
    } else {
      setIsErrorWorktimeLength(false)
    }
    if (breaktimeLength === 0) {
      setIsErrorBreaktimeLength(true)
      isErrorCount += 1
    } else {
      setIsErrorBreaktimeLength(false)
    }
    if (termCount === 0) {
      setIsErrorTermCount(true)
      isErrorCount += 1
    } else {
      setIsErrorTermCount(false)
    }
    if (longBreaktimeLength === 0) {
      setIsErrorLongBreaktimeLength(true)
      isErrorCount += 1
    } else {
      setIsErrorLongBreaktimeLength(false)
    }
    if (termRepeatCount === 0) {
      setIsErrorTermRepeatCount(true)
      isErrorCount += 1
    } else {
      setIsErrorTermRepeatCount(false)
    }
    if (isErrorCount > 0) {
      setIsError(true)
    } else {
      setIsError(false)
    }
  }

  const handleCreate = () => {
    validateForm()
    if (isError) {
      return
    }
    const pomodoro = {
      spotify_user_id: userId,
      name: pomodoroName,
      work_time_playlist_id: worktimePlaylist.id,
      break_time_playlist_id: breaktimePlaylist.id,
      work_time: worktimeLength,
      break_time: breaktimeLength,
      term_count: termCount,
      long_break_time: longBreaktimeLength,
      term_repeat_count: termRepeatCount,
    }
    createPomodoro(pomodoro).then((res) => {
      router.push(`/play_pomodoro/${res.pomodoro.id}`)
    })
  }

  const handleUpdate = () => {
    validateForm()
    if (isError) {
      return
    }
    const pomodoro = {
      id: props.pomodoro?.id,
      spotify_user_id: userId,
      name: pomodoroName,
      work_time_playlist_id: worktimePlaylist.id,
      break_time_playlist_id: breaktimePlaylist.id,
      work_time: worktimeLength,
      break_time: breaktimeLength,
      term_count: termCount,
      long_break_time: longBreaktimeLength,
      term_repeat_count: termRepeatCount,
    }
    updatePomodoro(pomodoro).then((res: { pomodoro: Pomodoro }) => {
      router.push(`/play_pomodoro/${res.pomodoro.id}`)
    })
  }

  useEffect(() => {
    if (props.pomodoro) {
      setPomodoroName(props.pomodoro.name)
      setWorktimePlaylist({
        id: props.pomodoro.work_time_playlist_id,
        name: props.pomodoro.work_time_playlist_name!,
      })
      setBreaktimePlaylist({
        id: props.pomodoro.break_time_playlist_id,
        name: props.pomodoro.break_time_playlist_name!,
      })
      setWorktimeLength(props.pomodoro.work_time)
      setBreaktimeLength(props.pomodoro.break_time)
      setTermCount(props.pomodoro.term_count)
      setLongBreaktimeLength(props.pomodoro.long_break_time)
      setTermRepeatCount(props.pomodoro.term_repeat_count)
    }
  }, [props.pomodoro])

  return (
    <div className="flex items-center justify-center">
      <div id="create-pomodoro-form" className="min-w-80">
        <div id="pomodoro-name-form" className="my-4">
          <label
            htmlFor="pomodoro_name"
            className="block text-sm font-medium leading-6 text-gray-700 dark:text-gray-300"
          >
            ポモドーロタイマー名
          </label>
          <div className="mt-2">
            {isErrorPomodoroName && (
              <div className="text-red-500 text-sm">
                ポモドーロタイマー名を入力してください
              </div>
            )}
            <div className="flex rounded-md shadow-sm ring-1 ring-inset bg-gray-50 dark:bg-gray-900 focus-within:ring-inset sm:max-w-md">
              <input
                type="text"
                name="pomodoro_name"
                id="pomodoro_name"
                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="ポモドーロタイマー名"
                value={pomodoroName}
                onChange={(e) => setPomodoroName(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div id="worktime-playlist-form" className="my-4">
          <label
            htmlFor="worktime-playlist"
            className="block text-sm font-medium leading-6 text-gray-700 dark:text-gray-300"
          >
            集中する間に再生するプレイリスト
          </label>
          <div className="mt-2">
            <button
              type="button"
              className="mr-4 rounded-md px-2.5 py-1.5 text-sm font-semibold shadow-sm light-button dark:dark-button"
              onClick={() => handleWorktimePlaylistModalOpen()}
            >
              選択
            </button>
            {isErrorWorktimePlaylist && (
              <div className="text-red-500 text-sm">
                プレイリストを選択してください
              </div>
            )}
            {worktimePlaylist?.name}
          </div>
        </div>
        <div id="breaktime-playlist-form" className="my-4">
          <label
            htmlFor="breaktime-playlist"
            className="block text-sm font-medium leading-6 text-gray-700 dark:text-gray-300"
          >
            休憩中に再生するプレイリスト
          </label>
          <div className="mt-2">
            <button
              type="button"
              className="mr-4 rounded-md  px-2.5 py-1.5 text-sm font-semibold shadow-sm light-button dark:dark-button"
              onClick={() => handleBreaktimePlaylistModalOpen()}
            >
              選択
            </button>
            {isErrorBreaktimePlaylist && (
              <div className="text-red-500 text-sm">
                プレイリストを選択してください
              </div>
            )}
            {breaktimePlaylist?.name}
          </div>
        </div>
        <div id="worktime-length-form" className="my-4">
          <label
            htmlFor="worktime-length"
            className="block text-sm font-medium leading-6 text-gray-700 dark:text-gray-300"
          >
            集中する時間
          </label>
          <div className="mt-2">
            {isErrorWorktimeLength && (
              <div className="text-red-500 text-sm">
                作業時間を入力してください
              </div>
            )}
            <div className="flex rounded-md shadow-sm ring-1 ring-inset bg-gray-50 dark:bg-gray-900 ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
              <input
                type="number"
                name="worktime-length"
                id="worktime-length"
                placeholder="25"
                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                value={
                  worktimeLength > 0 ? worktimeLength / 60 / 1000 : undefined
                }
                onChange={(e) =>
                  setWorktimeLength(Number(e.target.value) * 60 * 1000)
                }
              />
              <span className="inline-flex items-center px-3 text-gray-500 text-sm">
                分
              </span>
            </div>
          </div>
        </div>
        <div id="breaktime-length-form" className="my-4">
          <label
            htmlFor="breaktime-length"
            className="block text-sm font-medium leading-6 text-gray-700 dark:text-gray-300"
          >
            休憩時間
          </label>
          <div className="mt-2">
            {isErrorBreaktimeLength && (
              <div className="text-red-500 text-sm">
                休憩時間を入力してください
              </div>
            )}
            <div className="flex rounded-md shadow-sm ring-1 ring-inset bg-gray-50 dark:bg-gray-900 ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
              <input
                type="number"
                name="breaktime-length"
                id="breaktime-length"
                placeholder="5"
                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                value={
                  breaktimeLength > 0 ? breaktimeLength / 60 / 1000 : undefined
                }
                onChange={(e) =>
                  setBreaktimeLength(Number(e.target.value) * 60 * 1000)
                }
              />
              <span className="inline-flex items-center px-3 text-gray-500 text-sm">
                分
              </span>
            </div>
          </div>
        </div>
        <div id="term-count-form" className="my-4">
          <label
            htmlFor="term-count"
            className="block text-sm font-medium leading-6 text-gray-700 dark:text-gray-300"
          >
            セット数
          </label>
          <div className="mt-2">
            {isErrorTermCount && (
              <div className="text-red-500 text-sm">
                セット数を入力してください
              </div>
            )}
            <div className="flex rounded-md shadow-sm ring-1 ring-inset bg-gray-50 dark:bg-gray-900 ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
              <input
                type="number"
                name="term-count"
                id="term-count"
                placeholder="3"
                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                value={termCount > 0 ? termCount : undefined}
                onChange={(e) => setTermCount(Number(e.target.value))}
              />
              <span className="inline-flex items-center px-3 text-gray-500 text-sm">
                回
              </span>
            </div>
          </div>
        </div>
        <div id="term-breaktime-length-form" className="my-4">
          <label
            htmlFor="term-breaktime-length"
            className="block text-sm font-medium leading-6 text-gray-700 dark:text-gray-300"
          >
            全セット終了時の休憩時間
          </label>
          <div className="mt-2">
            {isErrorLongBreaktimeLength && (
              <div className="text-red-500 text-sm">
                セット終了時の休憩時間を入力してください
              </div>
            )}
            <div className="flex rounded-md shadow-sm ring-1 ring-inset bg-gray-50 dark:bg-gray-900 ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
              <input
                type="number"
                name="term-breaktime-length"
                id="term-breaktime-length"
                placeholder="30"
                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                value={
                  longBreaktimeLength > 0
                    ? longBreaktimeLength / 60 / 1000
                    : undefined
                }
                onChange={(e) =>
                  setLongBreaktimeLength(Number(e.target.value) * 60 * 1000)
                }
              />
              <span className="inline-flex items-center px-3 text-gray-500 text-sm">
                分
              </span>
            </div>
          </div>
        </div>
        <div id="term_repeat_count-form" className="my-4">
          <label
            htmlFor="term_repeat_count"
            className="block text-sm font-medium leading-6 text-gray-700 dark:text-gray-300"
          >
            セットを繰り返す回数
          </label>
          <div className="mt-2">
            {isErrorTermRepeatCount && (
              <div className="text-red-500 text-sm">
                セットを繰り返す回数を入力してください
              </div>
            )}
            <div className="flex rounded-md shadow-sm ring-1 ring-inset bg-gray-50 dark:bg-gray-900 ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
              <input
                type="number"
                name="term_repeat_count"
                id="term_repeat_count"
                placeholder="2"
                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                value={termRepeatCount > 0 ? termRepeatCount : undefined}
                onChange={(e) => setTermRepeatCount(Number(e.target.value))}
              />
              <span className="inline-flex items-center px-3 text-gray-500 text-sm">
                回
              </span>
            </div>
          </div>
        </div>
        <div id="submit-button" className="my-8 w-full">
          {props.mode === "create" ? (
            <button
              type="button"
              className="w-full rounded-md px-2.5 py-1.5 text-sm font-semibold shadow-sm light-button dark:dark-button"
              onClick={() => handleCreate()}
            >
              作成
            </button>
          ) : (
            <button
              type="button"
              className="w-full rounded-md px-2.5 py-1.5 text-sm font-semibold shadow-sm light-button dark:dark-button"
              onClick={() => handleUpdate()}
            >
              更新
            </button>
          )}
        </div>
      </div>
      <div className="w-8"></div>
      <div className="min-w-80">
        <TimeAllocationBar
          workTime={worktimeLength}
          breakTime={breaktimeLength}
          termCount={termCount}
          longBreakTime={longBreaktimeLength}
          termRepeatCount={termRepeatCount}
        />
      </div>
      <SelectPlaylistModal
        open={isWorktimePlaylistModalOpen}
        title={"集中する間に再生するプレイリストを選択"}
        declineButtonText={"キャンセル"}
        declineButtonOnClick={() => handleWorktimePlaylistModalClose()}
        closeModalOnClick={() => handleWorktimePlaylistModalClose()}
        selectPlaylistOnClick={(playlistId: string, playlistName: string) =>
          handleSetWorktimePlaylist(playlistId, playlistName)
        }
      />
      <SelectPlaylistModal
        open={isBreaktimePlaylistModalOpen}
        title={"休憩中に再生するプレイリストを選択"}
        declineButtonText={"キャンセル"}
        declineButtonOnClick={() => handleBreaktimePlaylistModalClose()}
        closeModalOnClick={() => handleBreaktimePlaylistModalClose()}
        selectPlaylistOnClick={(playlistId: string, playlistName: string) =>
          handleSetBreaktimePlaylist(playlistId, playlistName)
        }
      />
    </div>
  )
}
