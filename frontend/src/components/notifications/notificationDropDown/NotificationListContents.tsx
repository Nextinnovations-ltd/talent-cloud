import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import clsx from "clsx"
import React, { useState } from "react"

// Define the type for notification data
export interface NotificationData {
  title?: string
  message?: string
  [key: string]: string | undefined // for any additional string fields
  description?: string
}

interface NotificationListItemsProps {
  data?: NotificationData
  unRead?: boolean
  Readed?: boolean
}

const NotificationListItems: React.FC<NotificationListItemsProps> = ({ data = {}, unRead = true, Readed = false }) => {
  const [open, setOpen] = useState(false)


  return (
    <DropdownMenuItem
      onClick={e => {
        e.stopPropagation();
        setOpen(o => !o)
      }}
      className={clsx(
        "rounded-md mb-2 flex items-center gap-3 transition-colors w-[97%] mx-auto duration-150 px-2 relative cursor-pointer",
        unRead && "bg-blue-50 hover:bg-blue-100 font-semibold text-black",
        Readed && "bg-white  text-gray-500"
      )}
      onSelect={e => e.preventDefault()}
      aria-label={data?.title || data?.message || "Notification"}
    >
      {unRead && (
        <span className="absolute top-[-1px] right-[-1px] block h-3 w-3 rounded-full bg-blue-500 border-2 border-white" aria-label="Unread notification indicator"></span>
      )}
      <div className="flex flex-col px-2 w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex-1 min-w-0">
            <p
              className={clsx(unRead && "font-semibold", Readed && "font-normal text-black", "truncate")}
              title={data?.title || "No title"}
              aria-label={data?.title || "No title"}
            >
              {data?.title || <span className="text-gray-400 italic">(No title)</span>}
            </p>
          </div>
          {data?.message && (
            <button
              type="button"
              className="ml-2 focus:outline-none"
              aria-label={open ? "Hide message" : "Show message"}

              tabIndex={0}
            >
              {/* Chevron SVG */}
              <svg
                className={clsx("w-4 h-4 transition-transform duration-200", open && "rotate-90")}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
        {open && data?.message && (
          <div className="mt-1">
            <p className="text-xs text-gray-600 whitespace-pre-line">{data.message}</p>
          </div>
        )}
        <p className="text-gray-400 font-semibold text-xs">3 hours ago</p>
      </div>
    </DropdownMenuItem>
  )
}

export default NotificationListItems 