import * as yup from 'yup';


// Define reusable email and password validation schemas
export const emailValidation = yup
  .string()
  .email("Invalid email")
  .required("Email is required");

const passwordValidation = yup
  .string()
  .required("Password is required")

// Login auth schema
export const loginSchema = yup.object({
    email: emailValidation,
    password: passwordValidation,
  });
  