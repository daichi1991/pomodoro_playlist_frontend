'use client';

export const CreatePomodoroButton: React.FC = () => {
  return (
    <div>
      <a
        href="create_pomodoro"
        className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
      >
        create pomodoro
      </a>
    </div>
  );
};
