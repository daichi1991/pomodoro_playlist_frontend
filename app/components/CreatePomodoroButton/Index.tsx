export const CreatePomodoroButton: React.FC = () => {
  return (
    <div className="my-4 flex justify-center">
      <a
        href="create_pomodoro"
        className="px-8 py-2 rounded-md flex items-center justify-center text-xl light-button dark:dark-button"
      >
        <span className="i-material-symbols-add-circle-outline"></span>
        <span>新規作成</span>
      </a>
    </div>
  )
}
