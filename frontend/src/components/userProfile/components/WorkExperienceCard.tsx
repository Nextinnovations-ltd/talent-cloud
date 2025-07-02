import NOLOGO from '@/assets/Login/Login/VectorNO.svg';

interface WorkExperienceCardProps {
    logo?: string;
    title: string;
    companyName: string;
    experience: string;
    description: string;
    isEdit?: boolean;
}

export const WorkExperienceCard = ({
    logo,
    title,
    companyName,
    experience,
    description,
    isEdit = false
}: WorkExperienceCardProps) => {
    return (
        <div className="relative">
            {/* Edit icons if in edit mode */}
            {isEdit && (
                <div className="absolute top-2 right-2 flex gap-2 z-10">
                    {/* Replace with your actual edit/delete icons as needed */}
                    <button className="p-1 bg-white rounded-full shadow hover:bg-gray-100" title="Edit">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2h2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2a2 2 0 00-2 2v2z" /></svg>
                    </button>
                    <button className="p-1 bg-white rounded-full shadow hover:bg-gray-100" title="Delete">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
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