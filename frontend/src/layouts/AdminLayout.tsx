import AdminSideBar from "@/components/nav/admin/AdminSideBar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex items-center">
        <AdminSideBar/>
       <div className="p-5">
       <Outlet/>
       </div>
    </div>
  )
}

export default AdminLayout;
