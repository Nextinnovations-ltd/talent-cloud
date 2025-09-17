import Deletesvg from "@/assets/deletesvg";
import Downloadsvg from "@/assets/downloadsvg";
import Filesvg from "@/assets/filesvg"
import Marksvg from "@/assets/marksvg";
import MenuDot from "@/assets/menuDot"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

const ResumeItem = () => {
    return (
        <div className="w-[667px] flex items-start justify-between gap-4  rounded-[12px] border border-[#CBD5E1] p-[15px]"
        >
            <div className="flex gap-4">
                <div className="mt-3"> <Filesvg /></div>
                <div className="">
                    <h3 className="text-[24px] font-medium"> Myatmin Resume.pdf </h3>
                    <p className="text-[#575757] mt-[10px]">Resume last uploaded on 12/9/2025</p>
                </div>

                <div className="mt-3 bg-[#D7EAFF] h-[25px] flex items-center justify-center px-2 rounded-md text-[12px]">Default</div>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="mt-3 cursor-pointer w-[50px] flex items-center justify-center "><MenuDot /></div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end"  alignOffset={-80}  className="w-48 mt-3">

                    <DropdownMenuItem
                        className="cursor-pointer focus:bg-gray-100"
                    >
                    <Marksvg/>   Default
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="cursor-pointer focus:bg-gray-100"
                    >
                    <Downloadsvg/>   Download
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="cursor-pointer text-[#E50914] focus:bg-gray-100"
                    >
                    <Deletesvg/>   Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

        </div>
    )
}

export default ResumeItem

