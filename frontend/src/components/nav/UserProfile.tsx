import routesMap from '@/constants/routesMap'
import  { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AvatarProfile } from '../common/Avatar'
import { ChevronDown, ChevronUp, LogOut } from 'lucide-react'
import {
  removeTokenFromSessionStorage,
  removeTokensFromLocalStorage,
} from "@/helpers/operateBrowserStorage";
import { useGetJobSeekerProfileQuery } from '@/services/slices/jobSeekerSlice'
import { LogOutDialog } from '../common/LogOutDialog'




export const UserProfile = () => {
  const [open, setOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: profileData} = useGetJobSeekerProfileQuery();

  const userData = profileData?.data;
  

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
    window.location.href = "/emp/lp";
  };

  return (
    <div className='relative flex items-center gap-2 ' ref={dropdownRef}>
      <Link className='flex  items-center gap-3' to={`user/${routesMap?.profile?.path}`}>
        <AvatarProfile src={userData?.profile_image_url} />
      </Link>
      <button type="button"  onClick={() => setOpen((prev) => !prev)}>
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
        <LogOutDialog handleLogout={handleLogout} setShowLogoutDialog={setShowLogoutDialog} />
      )}
    </div>
  )
}
