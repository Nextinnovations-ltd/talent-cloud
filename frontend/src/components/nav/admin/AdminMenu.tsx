import AdminMenuItems from "@/components/common/Admin/AdminMenuItems";
import { LayoutDashboard } from "lucide-react";



const AdminMenu = () => {



    return (
        <div className='mt-[48px]'>
            <div
                className='flex  px-[24px] items-center justify-between cursor-pointer'
            >
                <p className='font-semibold text-[12px] text-[#575757]'>Menu</p>

            </div>
            <div className="mt-[16px] flex flex-col gap-[16px]">
                <AdminMenuItems
                    targetPath="/admin/dashboard"
                    icon={<LayoutDashboard />}
                    text="Dashboard"
                    exactMatch
                />
                {/* <AdminMenuItems
                    targetPath="/admin/dashboard/candidates"
                    icon={<Users />}
                    text="Candidates"
                /> */}

            </div>
        </div>
    )
}

export default AdminMenu;
