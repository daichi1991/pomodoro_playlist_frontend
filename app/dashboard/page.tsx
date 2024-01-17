import { PageTitle } from '../components/PageTitle/Index';
import { PomodoroList } from '../components/PomodoroList/Index';

export default function Dashboard() {
  return (
    <div>
      <PageTitle title="Dashboard" />
      <PomodoroList />
    </div>
  );
}
