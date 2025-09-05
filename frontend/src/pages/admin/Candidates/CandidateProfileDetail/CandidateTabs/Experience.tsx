import { useGetJobSeekerDetailExperienceQuery } from "@/services/slices/adminSlice";
import { skipToken } from "@reduxjs/toolkit/query";
import { useParams } from "react-router-dom";
import NOLOGO from "@/assets/Login/Login/VectorNO.svg";
import EMPTYTABS from '@/assets/SuperAdmin/EmptyTabs.png';
import CommonError from "@/components/CommonError/CommonError";


const Experience = () => {
    const { id } = useParams<{ id: string }>();
    const { data, isLoading } = useGetJobSeekerDetailExperienceQuery(id ? { id } : skipToken);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[300px]">
                Loading ...
            </div>
        )
    }

    if (!data?.data || data.data.length === 0) {
        return (
            <div className="text-center  text-gray-500 mt-20 text-lg">
                <CommonError
                    image={EMPTYTABS}
                    width={117}
                    title="No experience found"
                    description="The candidate hasn’t added any work experience." />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-[72px]">
            {data.data.map((e) => (
                <ExperienceCard
                    title={e.title}
                    organization={e.organization}
                    duration={e.duration}
                    description={e.description}
                />
            ))}
        </div>
    );
};

type ExperienceCardProps = {
    title: string;
    organization: string;
    duration: string;
    description: string;
};

const ExperienceCard: React.FC<ExperienceCardProps> = ({
    title,
    organization,
    duration,
    description,
}) => {
    return (
        <div className="p-6 rounded-2xl transition-shadow bg-white">
            <div className='w-[96px] bg-[#EFF2F6] flex items-center justify-center mb-[36px] h-[96px] rounded-full'>
                <img src={NOLOGO} alt="No Education Logo" />
            </div>
            <h3 className="mt-6 font-semibold text-2xl text-gray-800">{title}</h3>
            <h4 className="text-lg font-medium text-gray-600 mt-2">{organization}</h4>
            <p className="text-sm text-gray-500 mt-1">{duration}</p>
            <p className="text-gray-600 leading-7 mt-4">{description}</p>
        </div>
    );
};

export default Experience;
