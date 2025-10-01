import * as yup from "yup";

export const EducationYupSchema = yup.object({
  institution: yup.string().required("Institution is required"),
  degree: yup.string().required("Degree is required"),
  startDate: yup
    .string()
    .required("Start date is required")
    .test(
      "start-date-before-end-date",
      "Start Date must be earlier than End Date",
      function (value) {
        const { endDate } = this.parent;
        if (!value || !endDate) return true;

        const start = new Date(value);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) return true;

        return start < end;
      }
    ),
   
  endDate: yup
    .string()
    .required("End date is required")
    .test(
      "end-date-after-start-date",
      "End Date must be later than Start Date",
      function (value) {
        const { startDate } = this.parent;
        if (!startDate || !value) return true;

        const start = new Date(startDate);
        const end = new Date(value);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) return true;

        return end > start;
      }
    ),
  description: yup.string().required("Description is required"),
});
