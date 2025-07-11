import * as yup from "yup";

const SelectedProjectSchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string(),
  project_url: yup.string().required("Project url is required"),
  project_image_url: yup.string(),
  startDateYear: yup.string().required("Project start year is required"),
  startDateMonth: yup.string().required("Project start month is required"),
  endDateYear: yup.string().when(["is_ongoing"], ([is_ongoing], schema) =>
    is_ongoing === false ? schema.required("Project end year is required") : schema.notRequired()
  ),
  endDateMonth: yup.string().when(["is_ongoing"], ([is_ongoing], schema) =>
    is_ongoing === false ? schema.required("Project end month is required") : schema.notRequired()
  ),
  is_ongoing: yup.boolean().required("Project ongoing is required"),
  team_size: yup.number(),
});

export default SelectedProjectSchema;