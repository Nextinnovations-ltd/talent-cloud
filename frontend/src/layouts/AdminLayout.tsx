import AdminSideBar from "@/components/nav/admin/AdminSideBar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div>
      <AdminSideBar />
      <div className="ml-[263px] min-h-screen">
        {/* Sticky Header */}
        <div className="bg-white  border-b border-b-[#F2F2F2] w-full h-[50px] sticky top-0 z-50">
          {/* You can add header content here */}
        </div>

        <div className="p-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
