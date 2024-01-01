import { CreatePomodoroButton } from '../components/CreatePomodoroButton/Index';
import { Header } from '../components/Header/Index';
import { PomodoroList } from '../components/PomodoroList/Index';

export default function Home() {
  return (
    <div>
      <Header />
      <PomodoroList />
      <CreatePomodoroButton />
    </div>
  );
}
