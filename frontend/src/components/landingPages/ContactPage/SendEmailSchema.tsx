import * as yup from "yup";


export const SendEmailSchema = yup.object({
    name:yup.string().required("Name is required"),
    email:yup.string().required("Email is required").email("Invalid email format"),
    subject:yup.string().required("Subject is required").min(5, "Message must be at least 5 characters")
    .max(100, "Message must be less than 100 characters"),
    description:yup.string()
});