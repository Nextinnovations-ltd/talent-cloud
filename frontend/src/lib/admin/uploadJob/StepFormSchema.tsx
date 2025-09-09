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

  salary_min: yup
  .string()
  .when("salary_mode", {
    is: "range",
    then: (schema) =>
      schema
        .required("Minimum Salary is required.")
        // allow comma-formatted numbers by stripping commas for validation
        .test('is-integer', 'Minimum Salary must be an integer.', (value) => {
          if (!value) return false;
          const cleaned = String(value).replace(/,/g, '');
          return /^\d+$/.test(cleaned);
        })
        .test(
          "min-lte-max",
          "Minimum salary cannot be greater than maximum salary",
          function (value) {
            const { salary_max, salary_mode } = this.parent;
            if (salary_mode !== "range" || !value || !salary_max) return true;
            const minVal = Number(String(value).replace(/,/g, ''));
            const maxVal = Number(String(salary_max).replace(/,/g, ''));
            return minVal <= maxVal;
          }
        ),
    otherwise: (schema) => schema.optional(),
  }),

  salary_max: yup
  .string()
  .when("salary_mode", {
    is: "range",
    then: (schema) =>
      schema
        .required("Maximum Salary is required.")
        .test('is-integer', 'Maximum Salary must be an integer.', (value) => {
          if (!value) return false;
          const cleaned = String(value).replace(/,/g, '');
          return /^\d+$/.test(cleaned);
        })
        .test(
          "max-gte-min",
          "Maximum salary must be greater than or equal to minimum salary",
          function (value) {
            const { salary_min, salary_mode } = this.parent;
            if (salary_mode !== "range" || !value || !salary_min) return true;
            const maxVal = Number(String(value).replace(/,/g, ''));
            const minVal = Number(String(salary_min).replace(/,/g, ''));
            return maxVal >= minVal;
          }
        ),
    otherwise: (schema) => schema.optional(),
  }),

  salary_fixed: yup.string().when("salary_mode", {
    is: "fixed",
    then: (schema) => schema
      .required("Fixed Salary is required")
      .test('is-integer', 'Fixed Salary must be an integer.', (value) => {
        if (!value) return false;
        const cleaned = String(value).replace(/,/g, '');
        return /^\d+$/.test(cleaned);
      }),
    otherwise: (schema) => schema.optional(),
  }),

  project_duration: yup.string().required('Project Duration is required'),
  skills: yup.array().of(yup.string().required()).optional().default(undefined),
  experience_level: yup.string().required("Experience level is required"),
  experience_years: yup
  .number()
  .transform((value, originalValue) => {
    if (typeof originalValue === "string") {
      const cleaned = originalValue.replace(/,/g, "").trim();
      return cleaned === "" ? undefined : Number(cleaned);
    }
    return value;
  })
  .required("Experience year is required")
  .min(1, "Number of experience must be greater than 0")
  .integer("Experience years must be an integer"),


  number_of_positions: yup
    .number()
    .max(99, "Number of position should be only 2 digits")
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? 0 : value
    )
    .default(1)
    .required('Number of position is required')
    .min(1, "Number of positions must be greater than 0")
    ,

  last_application_date: yup
    .string()
    .required("Last applications date is required"),
});