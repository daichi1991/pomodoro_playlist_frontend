import { BackToDashboardButton } from "@/app/components/BackToDashboardButton/Index"
import { PageTitle } from "@/app/components/PageTitle/Index"
import { EditPomodoroForm } from "../../components/EditPomodoroForm/Index"

export default function EditPomodoro() {
  return (
    <div>
      <BackToDashboardButton />
      <PageTitle title="ポモドーロタイマー編集" />
      <EditPomodoroForm />
    </div>
  )
}
