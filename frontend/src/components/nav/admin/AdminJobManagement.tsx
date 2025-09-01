import AdminCreateJobItems from '@/components/common/Admin/AdminCreateJobItems';
import AdminMenuItems from '@/components/common/Admin/AdminMenuItems';
import { AlignCenterHorizontal, Briefcase, FileClock } from 'lucide-react';


const AdminJobManagement = () => {


  return (
    <div className='mt-[48px]'>
      <div
        className='flex  px-[24px] items-center justify-between cursor-pointer'
      >
        <p className='font-semibold text-[12px] text-[#575757]'>Job Management</p>

      </div>
      <AdminCreateJobItems />
      <div className="mt-[24px] flex flex-col gap-[16px]">
        <AdminMenuItems targetPath="/admin/dashboard/allJobs" icon={<Briefcase />} text="All Jobs" />
        <AdminMenuItems targetPath="/admin/dashboard/activeJobs" icon={<AlignCenterHorizontal />} text="Active Jobs" />
        <AdminMenuItems targetPath="/admin/dashboard/expiredJobs" icon={<FileClock />} text="Expired Jobs" />
      </div>
    </div>
  )
}

export default AdminJobManagement;
