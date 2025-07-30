import { Plus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";


 const AdminCreateJobItems = () => {

    const navigate = useNavigate();
    const { pathname } = useLocation();
    
    const isActive =  pathname.startsWith('/admin/dashboard/createNewJob');

  return (
    <div  onClick={() => navigate('/admin/dashboard/createNewJob')} className={`px-[20px] border border-[#0389FF] mt-[16px] h-[50px] duration-500 cursor-pointer font-semibold flex items-center justify-between  hover:bg-[#3699F069] rounded-[6px] hover:text-[#0481EF] ${isActive ? 'bg-[#0481EF] text-[#ffffff]' : 'text-[#0389FF]'}`}>
    <p>Create Job</p>
    <Plus/>
  </div>
  )
}

export default AdminCreateJobItems;