import * as yup from "yup";

export const UserProfileSchema = yup.object({
 profile_image_url:yup.string().optional(),
 name:yup.string().max(20).required("Display name is required"),
 username:yup.string().max(20).required("User name is required"),
 tagline:yup.string().max(60).required("Tagline is required"),
 role:yup.number().required("Specialization role is required"),
 experience_level:yup.number().required("Experience level is required"),
 experience_years:yup.number().required("Experience years is required"),
 bio:yup.string().max(250).optional(),
 email:yup.string().required("Email is required"),
 phone_number: yup.string().required(""),
 country_code: yup.string().required("Country code is required"),
 date_of_birth:yup.string().optional(),
 address:yup.string().optional(),
 resume_url:yup.string().optional()
});
