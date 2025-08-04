import AdminSideBar from "@/components/nav/admin/AdminSideBar";
import NotificationDropDown from "@/components/notifications/notificationDropDown";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div>
      <AdminSideBar />
      <div className="ml-[263px] min-h-screen">
        {/* Sticky Header */}
        <div className="bg-white flex items-center justify-end  border-b border-b-[#F2F2F2] w-full h-[50px] sticky top-0 z-50">
         <NotificationDropDown/>
        </div>

        <div className="p-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
