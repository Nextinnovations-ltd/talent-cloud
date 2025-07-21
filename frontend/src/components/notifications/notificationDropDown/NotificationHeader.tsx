import { X } from 'lucide-react'


export const NotificationHeader = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className='flex justify-between items-center  w-full'>
        <p>Notification</p>
        <button onClick={onClose} aria-label="Close notification dropdown">
          <X/>
        </button>
    </div>
  )
}
