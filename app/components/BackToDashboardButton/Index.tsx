"use client"

import { useRouter } from "next/navigation"

export const BackToDashboardButton: React.FC = () => {
  const router = useRouter()

  return (
    <div className="flex justify-start">
      <button
        className="text-gray-400 flex items-center border-b border-solid border-gray-400 hover:text-gray-600 hover:border-gray-600 cursor-pointer"
        onClick={() => router.push("/dashboard")}
      >
        <span className="i-material-symbols-arrow-back-rounded"></span>
        <span>Dashboard</span>
      </button>
    </div>
  )
}
