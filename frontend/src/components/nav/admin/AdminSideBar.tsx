import { LogOut } from "lucide-react"
import AdminJobManagement from "./AdminJobManagement"
import AdminLogo from "./AdminLogo"
import AdminMenu from "./AdminMenu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useRef, useState } from "react"
import {
  removeTokenFromSessionStorage,
  removeTokensFromLocalStorage,
} from "@/helpers/operateBrowserStorage";
import { LogOutDialog } from "@/components/common/LogOutDialog"
//import AdminNotification from "./AdminNotification"


const AdminSideBar = () => {
  const [open, setOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleLogout = () => {
    removeTokenFromSessionStorage();
    removeTokensFromLocalStorage();
    window.location.href = "/tc/lp";
  };
  
  return (
   <>
    <div className='w-[263px]  border-r-[#F2F2F2] h-[100svh] border flex flex-col fixed left-0 top-0 z-20 bg-white'>
      {/* Fixed top section */}
      <div className="pt-[15px] ">
        <AdminLogo/>
      </div>
      
      {/* Scrollable middle section */}
      <ScrollArea className="px-2  ">
        {/* <AdminList/> */}
        <div className=" "></div>
        <AdminMenu/>
        <AdminJobManagement/>
        {/* <AdminNotification/> */}
        <div onClick={()=> setShowLogoutDialog(true)} className="flex cursor-pointer gap-[24px] px-[20px] mt-[36px]">
          <LogOut color="#575757"/>
          <p className="text-[#0481EF] font-semibold">Log out</p>
        </div>
      </ScrollArea>

    </div>
     {showLogoutDialog && (
     <LogOutDialog handleLogout={handleLogout} setShowLogoutDialog={setShowLogoutDialog} />
    )}
   </>
  )
}

export default AdminSideBar