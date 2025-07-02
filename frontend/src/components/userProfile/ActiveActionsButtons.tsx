import { Button } from "../ui/button"
import { ReactNode } from "react"

interface ActiveActionsButtonsProps {
  icon: ReactNode;
  title: string;
  onClick?: () => void;
}

const ActiveActionsButtons = ({icon, title, onClick}: ActiveActionsButtonsProps) => {
  return (
    <div className="flex gap-[12px] items-center justify-center ">
        <Button className="w-[48px] hover:scale-105 hover:drop-shadow-md duration-1000 h-[48px] rounded-[48px] bg-[#F0F9FF]" onClick={onClick}>{icon}</Button>
        <h3 className="text-[#5B5B5C] text-[16px] font-semibold">{title}</h3>
    </div>
  )
}

export default ActiveActionsButtons
