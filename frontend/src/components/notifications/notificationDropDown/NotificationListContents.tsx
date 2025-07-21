import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import clsx from "clsx"

const NotificationListItems = ({ unRead = true, Readed = false }) => {
  return (
    <DropdownMenuItem
      className={clsx(
        "rounded-full mb-2 flex items-center gap-3 transition-colors duration-150 cursor-pointer",
        unRead && "bg-blue-50 hover:bg-blue-100 font-semibold text-black",
        Readed && "bg-slate-100 hover:bg-slate-200 text-gray-500"
      )}
      onSelect={e => e.preventDefault()}
    >
      <div className="relative">
        <img
          width={50}
          className={clsx(
            "rounded-full border",
            unRead ? "border-blue-400" : "border-gray-300"
          )}
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_LKyJc32Z0RhTQ0I6k0CPbQxZc_Z7HibKzQ&s"
        />
        {unRead && (
          <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-blue-500 border-2 border-white"></span>
        )}
      </div>
      <div className="flex flex-col w-full">
        <p className={clsx(unRead && "font-semibold", Readed && "font-normal")}>Scheduled Maintenance</p>
        <p className="text-[#575757] font-semibold text-xs">3 hours ago</p>
      </div>
    </DropdownMenuItem>
  )
}

export default NotificationListItems 