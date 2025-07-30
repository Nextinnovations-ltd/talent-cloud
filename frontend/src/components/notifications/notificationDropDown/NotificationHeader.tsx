import { useMarkedAsAllReadMutation } from '@/services/slices/notificationSlice'
import {  MailCheck } from 'lucide-react'

export const NotificationHeader = () => {

  const [markedAllRead] = useMarkedAsAllReadMutation();

  const handleAllRead =  ()=>{
   markedAllRead()
  }

  return (
    <div className='flex justify-between items-center  w-full'>
        <p>Notification</p>
        <button onClick={handleAllRead}  aria-label="Close notification dropdown">
          <MailCheck size={20}/>
        </button>
    </div>
  )
}
