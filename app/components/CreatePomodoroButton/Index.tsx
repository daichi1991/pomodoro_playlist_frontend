'use client';

export const CreatePomodoroButton: React.FC = () => {
  return (
    <div className="my-4 flex justify-center">
      <a
        href="create_pomodoro"
        className="hover:bg-gray-700 rounded-md px-3 py-2 flex items-center justify-center text-xl"
      >
        <span className="i-material-symbols-add-circle-outline"></span>
        <span>新規作成</span>
      </a>
    </div>
  );
};
