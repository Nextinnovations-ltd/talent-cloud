import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export const ProfileNavSideBar = () => {
  return (
    <div className="bg-white">
      <div className="flex items-center  justify-center  gap-5 container  mx-auto">
        <SidebarProvider className=" my-3 space-y-3 rounded-md">
          <main className=" mx-auto  w-[700px]   ">
            <Outlet />
          </main>
        </SidebarProvider>
      </div>
    </div>
  );
};
