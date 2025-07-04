import SvgDelete from "@/assets/svgs/SvgDelete";
import SvgEdit from "@/assets/svgs/SvgEdit";

interface SelectedProjectsProps {
    img: string;
    isEdit?: boolean;
}

export const SelectedProjects = ({ img, isEdit = false }: SelectedProjectsProps) => {
    return (
        <div className='w-[500px] bg-white text-[#FFFFFF] rounded-[20px] relative'>
            {isEdit && (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-[150px] h-[64px] gap-[30px] items-center justify-center rounded-full flex z-10">
                    <button className=" w-[40px] h-[40px] rounded-full bg-[#E0F2FE] shadow hover:bg-gray-100 flex items-center justify-center" title="Edit">
                    <SvgEdit size={22}/>
                    </button>
                    <button className=" w-[40px] h-[40px] rounded-full bg-[#E0F2FE] shadow hover:bg-gray-100 flex items-center justify-center" title="Edit">
                    <SvgDelete size={28}/>
                    </button>
                </div>
            )}
            <img className='h-[330px]' src={img} alt="Project" />
            <h1 className='text-[26px] text-[#05060F] font-[600] mt-[30px]'>Release Clinic</h1>
            <p className='text-[14px] text-[#6B6B6B] mt-[14px]'>Japanese No.1 Release Clinic Product</p>
        </div>
    );
}; 