import { useGetJobSeekerDetailEducationQuery } from "@/services/slices/adminSlice"
import { skipToken } from "@reduxjs/toolkit/query";
import { useParams } from "react-router-dom";
import NOEDU from '@/assets/Login/Login/Vector.svg';
import CommonError from "@/components/CommonError/CommonError";
import EMPTYTABS from '@/assets/SuperAdmin/EmptyTabs.png';


const Educations = () => {

  const { id } = useParams<{ id: string }>();
  const { data,isLoading } = useGetJobSeekerDetailEducationQuery(id ? { id } : skipToken);

  if(isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
       Loading ...
      </div>
    )
  } 

  if (!data?.data || data.data.length === 0 ) {
    return (
      <div className="text-center  text-gray-500 mt-20 text-lg">
      <CommonError 
        image={EMPTYTABS} 
        width={117} 
        title="No education found" 
        description="The candidate hasn’t added any education."/>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 mt-[72px] gap-[100px]">

      {
        data?.data.map((e) => <EducationsCard degree={e.degree} instiution={e.institution} duration={e.duration} description={e.description} />)
      }

    </div>
  )
}

type EducationCardProps = {
  degree: string;
  instiution: string;
  description: string;
  duration: string;
}

const EducationsCard: React.FC<EducationCardProps> = ({ degree, instiution, description, duration }) => {

  return (
    <div>
      <div className='w-[96px] bg-[#EFF2F6] flex items-center justify-center mb-[36px] h-[96px] rounded-full'>
        <img src={NOEDU} alt="No Education Logo" />
      </div>

      <h3 className="mt-[32px] font-semibold text-[20px] mb-[20px]">{degree}</h3>

      <h3 className="mb-[16px] text-[18px] font-[500px]">{instiution}</h3>

      <p className="text-[#6B6B6B] mb-[30px]">{duration}</p>

      <p className="text-[#6B6B6B] text-[18px] leading-[28px]">{description} </p>
    </div>
  )
}


export default Educations;
