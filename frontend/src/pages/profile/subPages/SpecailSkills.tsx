import { ProfileTitle } from "@/components/common/ProfileTitle";
import { SpecialSkillYupSchema } from "@/lib/SpecialSkillSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";


type SpecialSkillType = {
  certificationName: string;
  organizationIssue: string;
  issueYear: string;
  issueMonth: string;
  expirationYear?: string;
  expirationMonth?: string;
  noExpired: boolean;
  credentialURL: string;
};

const SpecailSkills = () => {


  const form = useForm<SpecialSkillType>({
    resolver:yupResolver(SpecialSkillYupSchema),
    defaultValues:{
      
    }
  })

  return (
    <div className="mb-[120px]">
      <ProfileTitle title="Professional Skill" /></div>
  )
}

export default SpecailSkills;
