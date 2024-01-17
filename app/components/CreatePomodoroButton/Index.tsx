export const CreatePomodoroButton: React.FC = () => {
  return (
    <div className="my-4 flex justify-center">
      <a
        href="create_pomodoro"
        className="px-8 py-2 bg-gray-800 ring-inset ring-gray-300 hover:bg-gray-500 rounded-md flex items-center justify-center text-xl"
      >
        <span className="i-material-symbols-add-circle-outline"></span>
        <span>新規作成</span>
      </a>
    </div>
  );
};
