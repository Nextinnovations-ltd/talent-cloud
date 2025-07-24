import AdminSideBar from "@/components/nav/admin/AdminSideBar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div>
      <AdminSideBar/>
       <div className="p-5 ml-[263px] min-h-screen">
       <Outlet/>
       </div>
    </div>
  )
}

export default AdminLayout;
