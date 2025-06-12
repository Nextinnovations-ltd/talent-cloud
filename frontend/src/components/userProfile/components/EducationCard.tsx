import SCHOOLLOGO from '@/assets/Login/SchoolLogo.svg';
import NOEDU from '@/assets/Login/Login/Vector.svg';

interface EducationCardProps {
    hasSchoolLogo?: boolean;
}

export const EducationCard = ({ hasSchoolLogo = false }: EducationCardProps) => {
    return (
        <div>
            {hasSchoolLogo ? (
                <img className='h-[96px] mb-[36px]' src={SCHOOLLOGO} alt="School Logo" />
            ) : (
                <div className='w-[96px] bg-[#EFF2F6] flex items-center justify-center mb-[36px] h-[96px] rounded-full'>
                    <img src={NOEDU} alt="No Education Logo" />
                </div>
            )}
            <div>
                <h3 className='font-bold text-[26px] mb-[20px]'>
                    Bachelor of Engineering in Information Technology
                </h3>
                <div>
                    <p className='text-[18px] mb-[16px]'>West Yangon Technological University</p>
                    <p className='text-[16px] text-[#6B6B6B] mb-[30px]'>Nov 2016 - May 2024</p>
                </div>
                <p className='text-[18px] text-[#6B6B6B]'>
                    During my time at university, I was involved in various hands-on projects, which gave me practical experience in conducting user research, developing wireframes and prototypes that prioritize both usability and aesthetics
                </p>
            </div>
        </div>
    );
}; 