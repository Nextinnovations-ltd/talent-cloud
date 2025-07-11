import { ProfileTitle } from "@/components/common/ProfileTitle";
import { SpecialSkillYupSchema } from "@/lib/SpecialSkillSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";


type SpecialSkillType = {
  skill_id:string;
  year_of_experience:string;
};

const SpecailSkills = () => {


  const form = useForm<SpecialSkillType>({
    resolver:yupResolver(SpecialSkillYupSchema),
    defaultValues:{
      skill_id:0,
      year_of_experience:0
    }
  })

  return (
    <div className="mb-[120px]">
      <ProfileTitle title="Professional Skill" /></div>
  )
}

export default SpecailSkills;
