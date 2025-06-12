import * as yup from "yup";

export const OnBoardingStepTwoSchema = yup.object({
    image: yup.mixed().required("Image is required"),
    name: yup.string().required("Name is required"),
    tagline: yup.string().required("Tagline is required"),
    level: yup.string().required("Level is required"),
    workExperience: yup.string().required("Work experience is required")
});
