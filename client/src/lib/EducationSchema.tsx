import * as yup from "yup";

export const EducationYupSchema = yup.object({
  institution: yup.string().required("Institution is required"),
  degree: yup.string().required("Degree is required"),
  startDate: yup.string().required("Start date is required"),
  endDate: yup.string().required("End date is required"),
  description: yup.string().required("Description is required"),
});
