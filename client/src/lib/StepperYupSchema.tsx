import * as yup from "yup";

export const TellUsAboutYouSchema = yup.object({
  username: yup.string().required("Username is required"),
  phonenumber: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9]+$/, "Phone number must be only numbers")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits"),
  address: yup.string().required("Address is required"),
  dateOfBirth: yup
    .number()
    .required("Date of birth is required")
    .min(1, "Day must be between 1 and 31")
    .max(31, "Day must be between 1 and 31"),
  dateOfMonth: yup
    .number()
    .required("Month is required")
    .min(1, "Month must be between 1 and 12")
    .max(12, "Month must be between 1 and 12"),
  dateOfYear: yup
    .number()
    .required("Year is required")
    .min(1900, "Year must be after 1900")
    .max(new Date().getFullYear(), `Year cannot be in the future`),
  image: yup
    .mixed()
    .required("Image is required")
});
