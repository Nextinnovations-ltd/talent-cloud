import { useMarkedAsAllReadMutation } from '@/services/slices/notificationSlice'
import { MailCheck } from 'lucide-react'

export const NotificationHeader = () => {

  const [markedAllRead] = useMarkedAsAllReadMutation();

  const handleAllRead = () => {
    markedAllRead()
  }

  return (
    <div className='flex justify-between items-center  w-full'>
      <p>Notification</p>
      <button onClick={handleAllRead} className='text-sm flex items-center gap-2' aria-label="Close notification dropdown">
              <MailCheck size={16} /> <p>Marked as all read</p>
      </button>
    </div>
  )
}
