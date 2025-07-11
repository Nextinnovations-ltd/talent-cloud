import * as yup from "yup";

export const VideoSchema = yup.object({
 title:yup.string().optional(),
});
