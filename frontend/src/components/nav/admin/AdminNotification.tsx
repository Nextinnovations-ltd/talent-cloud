import AdminMenuItems from '@/components/common/Admin/AdminMenuItems'
import { Bell } from 'lucide-react'

 const AdminNotification = () => {
  return (
    <div className='mt-[48px]'>
      <div
        className='flex  px-[24px] items-center justify-between cursor-pointer'
      >
        <p className='font-semibold text-[12px] text-[#575757]'>Marketing & Advertising</p>

      </div>
      <div className="mt-[24px] flex flex-col gap-[16px]">
        <AdminMenuItems targetPath="/admin/dashboard/pushNotification" icon={<Bell />} text="Push Notification" />
      </div>
    </div>
  )
}

export default AdminNotification
