import * as yup from "yup";


export const SpecialSkillYupSchema = yup.object({
    skill_id:yup.number().required("Skill is required"),
    year_of_experience:yup.number().required("Experience year is required")
})