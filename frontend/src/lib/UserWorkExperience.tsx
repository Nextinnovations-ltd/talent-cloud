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
    .required(''),

  description:yup.string().max(250)
}).test(
  "end-date-after-start-date",
  "End date must be after start date.",
  function (value) {
    const { is_present_work, startDateYear, startDateMonth, endDateYear, endDateMonth } = value || {};
    if (is_present_work) return true;
    if (!startDateYear || !startDateMonth || !endDateYear || !endDateMonth) return true;
    const start = new Date(Number(startDateYear), Number(startDateMonth) - 1);
    const end = new Date(Number(endDateYear), Number(endDateMonth) - 1);
    return end > start;
  }
);