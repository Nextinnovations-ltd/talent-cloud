import * as yup from "yup";

export const SkillYupSchema = yup.object({
  skill_list: yup
    .array()
    .required("Professional Experience is required"),
});
