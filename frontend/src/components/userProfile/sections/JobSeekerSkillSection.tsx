import { Badge } from '@/components/ui/badge';
import { Title } from '../Title'
import { useNavigate } from 'react-router-dom';
import { useGetJobSeekerUserSkillsQuery } from '@/services/slices/jobSeekerSlice';


export const JobSeekerSkillSection = () => {

  const {data,isLoading} = useGetJobSeekerUserSkillsQuery();


    const navigate = useNavigate();

  return (
    <div className='mb-[120px]'>
         <Title title={"Skills"} onpressAdd={()=>navigate(`/user/edit/skills`)} />
       <div className='flex gap-3 flex-wrap'>
       {
            isLoading ? (
              <div>Loading...</div>
            ) : (
              data?.data?.map((e,index)=><Badge key={index} className='p-[13px] bg-[#EDEDED] capitalize text-[16px] rounded-[46px] font'>{e.title}</Badge>)
            )
        }
       </div>
    </div>
  )
}
