import { CreatePomodoroForm } from '../components/CreatePomodoroForm/Index';
import { PageTitle } from '../components/PageTitle/Index';

export default function CreatePomodoro() {
  return (
    <div>
      <PageTitle title="ポモドーロ新規作成" />
      <CreatePomodoroForm />
    </div>
  );
}
