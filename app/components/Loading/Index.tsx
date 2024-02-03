import { BounceLoader } from "react-spinners"

export const Loading: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <BounceLoader color="#00bfff" />
    </div>
  )
}