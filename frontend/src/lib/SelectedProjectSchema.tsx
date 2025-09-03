import * as yup from "yup";

const SelectedProjectSchema = yup
  .object({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
    project_url: yup
      .string()
      .matches(/^https?:\/\//, "Project url must start with http:// or https://")
      .required("Project url is required"),
    project_image_url: yup.string(),
    startDateYear: yup.string().required("Project start year is required"),
    startDateMonth: yup.string().required("Project start month is required"),
    endDateYear: yup.string().when(["is_ongoing"], ([is_ongoing], schema) =>
      is_ongoing === false
        ? schema.required("Project end year is required")
        : schema.notRequired()
    ),
    endDateMonth: yup.string().when(["is_ongoing"], ([is_ongoing], schema) =>
      is_ongoing === false
        ? schema.required("Project end month is required")
        : schema.notRequired()
    ),
    is_ongoing: yup.boolean().required("Project ongoing is required"),
    team_size: yup.number(),
  })
  // ✅ End date must be after start date
  .test(
    "end-date-after-start-date",
    "End date cannot be earlier than start date.",
    function (value) {
      const { is_ongoing, startDateYear, startDateMonth, endDateYear, endDateMonth } =
        value || {};
      if (is_ongoing) return true;
      if (!startDateYear || !startDateMonth || !endDateYear || !endDateMonth) return true;

      const start = new Date(Number(startDateYear), Number(startDateMonth) - 1);
      const end = new Date(Number(endDateYear), Number(endDateMonth) - 1);

      return end >= start || this.createError({ path: "endDateYear" });
    }
  )
  // ✅ End date cannot be in the future
  .test(
    "end-date-not-in-future",
    "End date cannot be in the future.",
    function (value) {
      const { is_ongoing, endDateYear, endDateMonth } = value || {};
      if (is_ongoing) return true;
      if (!endDateYear || !endDateMonth) return true;

      const end = new Date(Number(endDateYear), Number(endDateMonth) - 1);
      const now = new Date();

      const endComparable = new Date(end.getFullYear(), end.getMonth(), 1);
      const nowComparable = new Date(now.getFullYear(), now.getMonth(), 1);

      return (
        endComparable <= nowComparable || this.createError({ path: "endDateYear" })
      );
    }
  )
  // ✅ Start date cannot be in the future
  .test(
    "start-date-not-in-future",
    "Start date cannot be in the future.",
    function (value) {
      const { startDateYear, startDateMonth } = value || {};
      if (!startDateYear || !startDateMonth) return true;

      const start = new Date(Number(startDateYear), Number(startDateMonth) - 1);
      const now = new Date();

      const startComparable = new Date(start.getFullYear(), start.getMonth(), 1);
      const nowComparable = new Date(now.getFullYear(), now.getMonth(), 1);

      return (
        startComparable <= nowComparable || this.createError({ path: "startDateYear" })
      );
    }
  );

export default SelectedProjectSchema;
