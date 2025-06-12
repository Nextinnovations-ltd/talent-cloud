import * as yup from "yup";

export const UserWorkExperienceSchema = yup.object({
  organization: yup
    .string()
    .max(50, "Organization name must be at most 20 characters")
    .required("Organization name is required"),

  title: yup
    .string()
    .max(50, "Job title must be at most 20 characters")
    .required("Job title is required"),

  startDateYear: yup
    .string()
    .required("Start year is required"),

  startDateMonth: yup
    .string()
    .required("Start month is required"),

  endDateYear: yup
    .string().when("is_present_work", (is_present_work, schema) => {
      if (!is_present_work[0])
        return schema.required('End year is required')
      return schema
    }),
  endDateMonth: yup
    .string().when("is_present_work", (is_present_work, schema) => {
      if (!is_present_work[0])
        return schema.required("End month is required")
      return schema
    }),

  is_present_work: yup
    .boolean()
    .required('')
});