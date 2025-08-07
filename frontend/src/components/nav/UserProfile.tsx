import routesMap from '@/constants/routesMap'
import  { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AvatarProfile } from '../common/Avatar'
import { ChevronDown, ChevronUp, LogOut } from 'lucide-react'
import {
  removeTokenFromSessionStorage,
  removeTokensFromLocalStorage,
} from "@/helpers/operateBrowserStorage";




export const UserProfile = () => {
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
    window.location.href = "/auth/login";
  };

  return (
    <div className='relative flex items-center gap-2' ref={dropdownRef}>
      <Link className='flex items-center gap-3' to={`user/${routesMap?.mainProfile?.path}`}>
        <AvatarProfile />
      </Link>
      <button type="button" onClick={() => setOpen((prev) => !prev)}>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-40 bg-white  rounded-md z-50 drop-shadow-md  py-2">
          <button
            className="w-full flex items-center gap-2 text-[14px]  text-left px-4 py-2 hover:bg-gray-100 text-[#575757]"
            onClick={() => setShowLogoutDialog(true)}
          >
          <LogOut size={18}/> <p> Logout</p>
          </button>
        </div>
      )}
      {/* Custom Modal for Logout Confirmation */}
      {showLogoutDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
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
    </div>
  )
}
