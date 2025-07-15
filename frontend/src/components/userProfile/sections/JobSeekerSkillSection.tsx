import { Badge } from '@/components/ui/badge';
import { Title } from '../Title'
import { useNavigate } from 'react-router-dom';

const skills = ["User Interface Design","User Experience Design","Product Design","Graphic Design","Visual Design","Figma","Adobe Photoshop","CSS","PHP","MySQL","Adobe Illustrator"]

export const JobSeekerSkillSection = ({
  isSkillEdit,
  setIsSkillEdit,
}:{
  isSkillEdit: boolean;
  setIsSkillEdit: React.Dispatch<React.SetStateAction<boolean>>;
}) => {

    const navigate = useNavigate();

  return (
    <div className='mb-[120px]'>
         <Title title={"Skills"}   onEditToggle={() => setIsSkillEdit((prev) => !prev)}  isEdit={isSkillEdit} onpressAdd={()=>navigate(`/user/edit/video-introduction`)} />
       <div className='flex gap-3 flex-wrap'>
       {
            skills?.map((e,index)=><Badge key={index} className='p-[13px] bg-[#EDEDED] text-[16px] rounded-[46px] font-semibold'>{e}</Badge>)
        }
       </div>
    </div>
  )
}
