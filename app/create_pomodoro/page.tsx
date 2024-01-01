import { CreatePomodoroForm } from '../components/CreatePomodoroForm/Index';
import { Header } from '../components/Header/Index';

export default function Home() {
  return (
    <div>
      <Header />
      <CreatePomodoroForm />
    </div>
  );
}
