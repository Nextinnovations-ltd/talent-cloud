import NOLOGO from '@/assets/Login/Login/VectorNO.svg';
import SvgDelete from '@/assets/svgs/SvgDelete';
import SvgEdit from '@/assets/svgs/SvgEdit';
import { useNavigate } from 'react-router-dom';

interface WorkExperienceCardProps {
    logo?: string;
    title: string;
    companyName: string;
    experience: string;
    description: string;
    isEdit?: boolean;
    id?:number
}

export const WorkExperienceCard = ({
    logo,
    title,
    companyName,
    experience,
    description,
    isEdit = false,
    id
}: WorkExperienceCardProps) => {
    const navigate = useNavigate();
    return (
        <div  className="relative">
            {/* Edit icons if in edit mode */}
            {isEdit && (
                <div className="absolute top-2 right-2 flex gap-2 z-10">
                    {/* Replace with your actual edit/delete icons as needed */}
                    <button onClick={()=>navigate(`/user/edit/workexperience?id=${id}`)} className="p-1 w-[35px] h-[35px] flex items-center justify-center rounded-full bg-white  shadow hover:bg-gray-100" title="Edit">
                        <SvgEdit size={16}/>
                    </button>
                    <button className="p-1 w-[35px] h-[35px] bg-white rounded-full shadow hover:bg-gray-100" title="Delete">
                        <SvgDelete size={18}/>
                    </button>
                </div>
            )}
            {logo ? (
                <img className='h-[96px] mb-[36px]' src={logo} alt="Company Logo" />
            ) : (
                <div className='w-[96px] bg-[#EFF2F6] flex items-center justify-center mb-[36px] h-[96px] rounded-full'>
                    <img src={NOLOGO} alt="No Logo" />
                </div>
            )}
            <div>
                <h3 className='font-bold text-[26px] mb-[20px]'>{title}</h3>
                <div>
                    <p className='text-[18px] mb-[16px]'>{companyName}</p>
                    <p className='text-[16px] text-[#6B6B6B] mb-[30px]'>{experience}</p>
                </div>
                <p className='text-[18px] text-[#6B6B6B]'>{description}</p>
            </div>
        </div>
    );
}; 