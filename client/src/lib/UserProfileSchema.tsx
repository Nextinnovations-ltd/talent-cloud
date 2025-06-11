import * as yup from "yup";

export const UserProfileSchema = yup.object({
  name: yup.string().max(20).required("Name is required"),
  username: yup.string().max(20).required("User name is required"),
  specialization_id: yup.number().required("Job specialization is required"),
  experience_level_id: yup
    .number()
    .required("Professional experience is required"),
  phone_number: yup.string().required(""),
  country_code: yup.string().required("Country code is required"),
  address: yup.string().max(30).required("Location is required"),
  // date_of_birth: yup.string(),
  bio: yup.string().max(250).required("Bio is required"),
  profile_image_url: yup.mixed()
});
