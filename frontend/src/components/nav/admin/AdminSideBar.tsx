import { LogOut } from "lucide-react"
import AdminJobManagement from "./AdminJobManagement"
import AdminList from "./AdminList"
import AdminLogo from "./AdminLogo"
import AdminMenu from "./AdminMenu"
import { ScrollArea } from "@/components/ui/scroll-area"

const AdminSideBar = () => {
  
  return (
    <div className='w-[263px]  border-r-[#F2F2F2] h-[100svh] border flex flex-col fixed left-0 top-0 z-20 bg-white'>
      {/* Fixed top section */}
      <div className="pt-[34px]">
        <AdminLogo/>
      </div>
      
      {/* Scrollable middle section */}
      <ScrollArea className="px-2 py-4">
        <AdminList/>
        <div className="border-t border-[#F2F2F2] mt-[16px]"></div>
        <AdminMenu/>
        <AdminJobManagement/>
        <div className="flex gap-[24px] px-[20px] mt-[36px]">
          <LogOut color="#575757"/>
          <p className="text-[#0481EF] font-semibold">Log out</p>
        </div>
      </ScrollArea>
      
    </div>
  )
}

export default AdminSideBar