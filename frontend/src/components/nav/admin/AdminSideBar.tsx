import { LogOut } from "lucide-react"
import AdminJobManagement from "./AdminJobManagement"
import AdminList from "./AdminList"
import AdminLogo from "./AdminLogo"
import AdminMenu from "./AdminMenu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useRef, useState } from "react"
import {
  removeTokenFromSessionStorage,
  removeTokensFromLocalStorage,
} from "@/helpers/operateBrowserStorage";


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
      <div className="pt-[34px]">
        <AdminLogo/>
      </div>
      
      {/* Scrollable middle section */}
      <ScrollArea className="px-2 py-4">
        {/* <AdminList/> */}
        <div className="border-t border-[#F2F2F2] mt-[16px]"></div>
        <AdminMenu/>
        <AdminJobManagement/>
        <div onClick={()=> setShowLogoutDialog(true)} className="flex cursor-pointer gap-[24px] px-[20px] mt-[36px]">
          <LogOut color="#575757"/>
          <p className="text-[#0481EF] font-semibold">Log out</p>
        </div>
      </ScrollArea>

     
      
    </div>
     {showLogoutDialog && (
      <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black bg-opacity-30">
        <div className="bg-white rounded-lg p-6 w-[500px] shadow-lg animate-fade-in">
          <h2 className="text-lg font-semibold mb-4 ">Are you sure you want to logout?</h2>
          <p>You’ll be signed out of your account and need to log in again to continue.</p>
          <div className="flex justify-end gap-2 mt-3">
            
            <button
              className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
              onClick={handleLogout}
            >
              Logout
            </button>
            <button
              className="px-4 py-2 rounded bg-white hover:bg-white/50 border-slate-200 border text-gray-700"
              onClick={() => setShowLogoutDialog(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
   </>
  )
}

export default AdminSideBar