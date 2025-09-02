import * as yup from "yup";

export const OnBoardingStepTwoSchema = yup.object({
    image: yup.mixed().optional().nullable(),
    name: yup.string().required("Name is required"),
    tagline: yup.string().required("Tagline is required"),
    level: yup.string().required("Level is required"),
    workExperience: yup.number()
    .transform((value, originalValue) =>
        originalValue === "" || originalValue === null || Number.isNaN(value)
            ? undefined
            : Number(originalValue)
    )
    .required("Experience years is required")
    .integer("Experience years must be an integer")
    .min(1, "Experience years must be at least 1"),
});
