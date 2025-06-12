import * as yup from "yup";

export const LanguagesYupSchema = yup.object({
  languages: yup
    .array()
    .of(
      yup.object({
        language: yup.string().required("language is required"),
        proficiency: yup.string().required("Proficiency is required"),
      })
    )
    .required()
    .default([]),
});
