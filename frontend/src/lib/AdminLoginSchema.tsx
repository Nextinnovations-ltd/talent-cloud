import * as yup from 'yup';


// Define reusable email and password validation schemas
export const emailValidation = yup
  .string()
  .email("Invalid email")
  .required("Email is required");

const passwordValidation = yup
  .string()
  .required("Password is required")
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    "Password must be at least 8 characters, include uppercase, lowercase, numbers, and symbols."
  );

// Login auth schema
export const loginSchema = yup.object({
    email: emailValidation,
    password: passwordValidation,
  });
  