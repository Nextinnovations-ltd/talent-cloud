import * as yup from "yup";


export const StepOneFormYupSchema = yup.object({
    title:yup.string().required("Title is required"),
    specialization:yup.string().required("Specialization is required"),
    role:yup.string().required("Role is required"),
    job_type:yup.string().required("Job type is required"),
    location:yup.string().required("Location is required"),
    work_type:yup.string().required("Work type is required"),
    description:yup.string().required("Description is required")
});


export const StepTwoFormYupSchema = yup.object({
    responsibilities:yup.string().required("Responsibilities is required"),
    requirements:yup.string().required("Requirements is required"),
    offered_benefits:yup.string().required("Offer is required"),
});


export const StepThreeFormYupSchema = yup.object({
  is_salary_negotiable: yup
    .boolean()
    .required("Salary negotiable field is required")
    .default(false),

  salary_mode: yup.string().when("is_salary_negotiable", {
    is: false,
    then: (schema) =>
      schema
        .required("Salary Rate is required"),
    otherwise: (schema) => schema.optional(),
  }),

  salary_type: yup.string().required("Salary type is required"),

  salary_min: yup.string().when("salary_mode", {
    is: "range",
    then: (schema) =>
      schema
        .required("Minimum Salary is required.")
        .test(
          "min-lte-max",
          "Minimum salary cannot be greater than maximum salary",
          function (value) {
            const { salary_max, salary_mode } = this.parent;
            if (salary_mode !== "range" || !value || !salary_max) return true;
            return Number(value) <= Number(salary_max);
          }
        ),
    otherwise: (schema) => schema.optional(),
  }),

  salary_max: yup.string().when("salary_mode", {
    is: "range",
    then: (schema) =>
      schema
        .required("Maximum Salary is required.")
        .test(
          "max-gte-min",
          "Maximum salary must be greater than or equal to minimum salary",
          function (value) {
            const { salary_min, salary_mode } = this.parent;
            if (salary_mode !== "range" || !value || !salary_min) return true;
            return Number(value) >= Number(salary_min);
          }
        ),
    otherwise: (schema) => schema.optional(),
  }),

  salary_fixed: yup.string().when("salary_mode", {
    is: "fixed",
    then: (schema) => schema.required("Fixed Salary is required"),
    otherwise: (schema) => schema.optional(),
  }),

  project_duration: yup.string().optional(),
  skills: yup.array().of(yup.string().required()).optional().default(undefined),
  experience_level: yup.string().optional(),
  experience_years: yup.string().optional(),

  number_of_positions: yup
    .number()
    .max(999, "Number of positions cannot exceed 3 digits")
    .default(0),

  last_application_date: yup
    .string()
    .required("Last applications date is required"),
});