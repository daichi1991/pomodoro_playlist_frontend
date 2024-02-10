import { BackToDashboardButton } from "../components/BackToDashboardButton/Index"
import { CreatePomodoroForm } from "../components/CreatePomodoroForm/Index"
import { PageTitle } from "../components/PageTitle/Index"

export default function CreatePomodoro() {
  return (
    <div>
      <BackToDashboardButton />
      <PageTitle title="ポモドーロタイマー新規作成" />
      <CreatePomodoroForm />
    </div>
  )
}
