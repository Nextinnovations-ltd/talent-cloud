import NOLOGO from '@/assets/Login/Login/VectorNO.svg';

interface WorkExperienceCardProps {
    logo?: string;
    title: string;
    companyName: string;
    experience: string;
    description: string;
}

export const WorkExperienceCard = ({
    logo,
    title,
    companyName,
    experience,
    description
}: WorkExperienceCardProps) => {
    return (
        <div>
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