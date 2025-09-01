import * as yup from "yup";

export const UserProfileSchema = yup.object({
    profile_image_url: yup.string().optional(),
    name: yup.string().max(20).required("Display name is required"),
    username: yup.string().max(20).required("User name is required"),
    tagline: yup.string().max(60).required("Tagline is required"),
    role: yup.string().required("Role is required"),
    specializations: yup
        .number()
        .transform((value, originalValue) =>
            originalValue === "" || originalValue === null || Number.isNaN(value)
                ? undefined
                : Number(originalValue)
        )
        .required("Specialization specialize is required"),
    experience_level: yup
        .number()
        .transform((value, originalValue) =>
            originalValue === "" || originalValue === null || Number.isNaN(value)
                ? undefined
                : Number(originalValue)
        )
        .required("Experience level is required"),

    experience_years: yup
        .number()
        .transform((value, originalValue) =>
            originalValue === "" || originalValue === null || Number.isNaN(value)
                ? undefined
                : Number(originalValue)
        )
        .required("Experience years is required")
        .integer("Experience years must be an integer")
        .min(1, "Experience years must be at least 1"),

    bio: yup.string().max(250).optional(),
    email: yup.string().required("Email is required"),
    phone_number: yup.string().required("Phone number is required"),
    country_code: yup.string().required("Country code is required"),
    date_of_birth: yup.string().optional(),
    address: yup.string().optional(),
    resume_url: yup.string().optional(),
    is_open_to_work: yup.boolean().required(),
    country: yup
        .number()
        .transform((value, originalValue) =>
            originalValue === "" || originalValue === null || Number.isNaN(value)
                ? undefined
                : Number(originalValue)
        )
        .required("Country is required"),
    city: yup
        .number()
        .transform((value, originalValue) =>
            originalValue === "" || originalValue === null || Number.isNaN(value)
                ? undefined
                : Number(originalValue)
        )
        .required("City is required"),
    linkedin_url: yup.string().optional(),
    behance_url: yup.string().optional(),
    portfolio_url: yup.string().optional(),
    github_url: yup.string().optional(),
});
