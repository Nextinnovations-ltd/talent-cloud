import AdminMenuItems from '@/components/common/Admin/AdminMenuItems';
import { AlignCenterHorizontal, Briefcase, FileClock, Plus } from 'lucide-react';


 const AdminJobManagement = () => {

    const isActive = false;
  return (
    <div className='mt-[48px]'>
    <div
        className='flex  px-[24px] items-center justify-between cursor-pointer'
    >
        <p className='font-semibold text-[12px] text-[#575757]'>Job Management</p>

    </div>
    <div className={`px-[20px] border border-[#0389FF] mt-[16px] h-[50px] duration-500 cursor-pointer font-semibold flex items-center justify-between  hover:bg-[#3699F069] rounded-[6px] hover:text-[#0481EF] ${isActive ? 'bg-[#0481EF] text-[#ffffff]' : 'text-[#0389FF]'}`}>
    <p>Create Job</p>
    <Plus/>
  </div>
  <div className="mt-[24px] flex flex-col gap-[16px]">
  <AdminMenuItems icon={<Briefcase/>} text="All Jobs"/>
  <AdminMenuItems icon={<AlignCenterHorizontal/>} text="Active Jobs"/>
  <AdminMenuItems icon={<FileClock/>} text="Expired Jobs"/>
  </div>
</div>
  )
}

export default AdminJobManagement;
