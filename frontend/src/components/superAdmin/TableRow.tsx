import Profile from "@/assets/SuperAdmin/user-profile.png"
import Phone from "@/assets/SuperAdmin/phone.svg"
import Location from "@/assets/SuperAdmin/location.svg"
import { Checkbox } from "@/components/ui/checkbox"

const TableRow = () => {
    return (
        <tr className='max-w-[1063px] px-[19.5px] py-[43px] flex items-center gap-[62px] border-b border-[#CBD5E1]'>
            <td>
                <Checkbox className="w-5 h-5 border border-[#CBD5E1] bg-[#FFF]" />
            </td>
            <td>
                <div className='flex gap-[7px] items-center'>
                    <img src={Profile} className='rounded-full w-[48px] h-[48px]' alt="" />
                    <div className='text-[12px] space-y-[5px]'>
                        <p className='font-semibold text-[#000]'>Than Naung</p>
                        <p className='font-normal text-[#575757]'>Fronted Developer</p>
                    </div>
                </div>
            </td>
            <td>
                <div className='flex gap-[10px] text-[#575757] items-center'>
                    <img src={Phone} alt="" />
                    <p className='text-[12px] font-medium'>+95 9123456789</p>
                </div>
            </td>
            <td>
                <div className='flex gap-[10px] text-[#575757] items-center'>
                    <img src={Location} alt="" />
                    <p className='text-[12px] font-medium'>Yangon , Myanmar</p>
                </div>
            </td>
            <td>
                <div className='flex gap-[10px] text-[#575757] items-center'>
                    <div className="w-[14px] h-[14px] rounded-full bg-[#29EA5F]"></div>
                    <p className='text-[12px] font-medium'>Available for Work</p>
                </div>
            </td>
            <td>
                <div className='w-[102px]'>
                    <button className='bg-[#0481EF] w-full py-[7.5px] text-[12px] font-semibold rounded-md text-[#FFFFFF] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.09)] hover:shadow-none'>Download CV</button>
                </div>
            </td>
        </tr>
    );
}

export default TableRow;
