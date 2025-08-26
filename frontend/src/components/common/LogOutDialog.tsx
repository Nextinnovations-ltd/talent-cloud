import React from 'react'

type LogOutDialogProps = {
    handleLogout: () => void;
    setShowLogoutDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LogOutDialog:React.FC<LogOutDialogProps> = ({handleLogout,setShowLogoutDialog}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[1000] bg-black bg-opacity-30">
          <div className="bg-white rounded-lg p-6 w-[500px] shadow-lg animate-fade-in">
            <h2 className="text-lg font-semibold mb-4 ">Are you sure you want to logout?</h2>
            <p>You’ll be signed out of your account and need to log in again to continue.</p>
            <div className="flex justify-end gap-2 mt-3">
              <button
                className="px-4 py-2 rounded bg-white hover:bg-white/50 border-slate-200 border text-gray-700"
                onClick={() => setShowLogoutDialog(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
  )
}
