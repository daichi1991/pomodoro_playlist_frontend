import { PageTitle } from '@/app/components/PageTitle/Index';
import { EditPomodoroForm } from '../../components/EditPomodoroForm/Index';

export default function EditPomodoro() {
  return (
    <div>
      <PageTitle title="ポモドーロ編集" />
      <EditPomodoroForm />
    </div>
  );
}