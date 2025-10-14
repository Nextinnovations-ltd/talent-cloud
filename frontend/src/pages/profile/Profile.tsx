import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { ProfileSideBar } from "./ProfileSideBar";

export const ProfileNavSideBar = () => {
  return (
    <div className="bg-white">
      <div className="flex items-center  justify-center  gap-5 container  mx-auto">
        <SidebarProvider  className="space-y-3 rounded-md">
          <ProfileSideBar/>
          <main className=" ml-[20px] w-[80%]">
            <Outlet />
          </main>
        </SidebarProvider>
      </div>
    </div>
  );
};
