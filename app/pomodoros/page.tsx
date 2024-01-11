import { CreatePomodoroButton } from '../components/CreatePomodoroButton/Index';
import { PomodoroList } from '../components/PomodoroList/Index';

export default function Home() {
  return (
    <div>
      <PomodoroList />
      <CreatePomodoroButton />
    </div>
  );
}
