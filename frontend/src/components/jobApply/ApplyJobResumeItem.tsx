import { Button } from "../ui/button";
import { Download, Eye, Trash } from "lucide-react";


const ApplyJobResumeItem = () => {
  return (
   <div className="flex items-center mt-[30px] gap-5">
     <Button className=" h-[51px]  p-[10px] border border-slate-300 bg-[#E6F3FF]">12/9/2025  Myatmin Resume </Button>
     <Button className="w-[48px] hover:bg-gray-300 flex items-center justify-center h-[48px] rounded-full bg-gray-200">
        <Eye size={18}/>
     </Button>
     <Button className="w-[48px] hover:bg-gray-300 flex items-center justify-center h-[48px] rounded-full bg-gray-200">
        <Download size={18}/>
     </Button>
     <Button className="w-[48px] hover:bg-gray-300 flex items-center justify-center h-[48px] rounded-full bg-gray-200">
        <Trash size={18}/>
     </Button>
   </div>
  )
}

export default ApplyJobResumeItem
