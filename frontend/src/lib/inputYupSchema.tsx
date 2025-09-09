import * as yup from "yup";

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
    "Password must be at least 8 characters, include uppercase, lowercase, numbers and symbols"
  );

// Login auth schema
export const loginSchema = yup.object({
  email: emailValidation,
  password: passwordValidation,
  rememberMe: yup.boolean(),
});

// Sign up auth schema
export const SignUpSchema = yup.object({
  email: emailValidation,
  password: passwordValidation,
  tap: yup
    .boolean()
    .oneOf([true], "This field must be checked.") // Ensures only true is valid
    .required("This field must be checked."), // Optional but ensures it's always provided
});

// Forgot password schema
export const ForgotPasswordSchema = yup.object({
  email: emailValidation,
});

// Forgot username
export const UsernameSchema = yup.object({
  username:yup.string().required("Username is required").max(20)
})

// Reset password schema
export const ResetPasswordSchema = yup.object({
  password: passwordValidation,
});

// OTP schema
export const OTPSchema = yup.object({
  verification_code: yup
  .string()
  .required("Verification code is required")
  .length(6, "Verification code must be exactly 6 characters"),
})
