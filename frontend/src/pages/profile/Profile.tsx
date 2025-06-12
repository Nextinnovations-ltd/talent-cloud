import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { ProfileSideBar } from "./ProfileSideBar";

export const ProfileNavSideBar = () => {
  return (
    <div className="bg-white">
      <div className="flex items-center  justify-center  gap-5 container  mx-auto">
        <SidebarProvider className=" my-3 space-y-3 rounded-md">
          <div className=" relative h-auto   ">
            <ProfileSideBar />
          </div>
          <main className=" ml-[50px]  w-full ">
            <Outlet />
          </main>
        </SidebarProvider>
      </div>
    </div>
  );
};
