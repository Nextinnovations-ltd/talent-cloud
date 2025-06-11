export const fields: any[] = [
  {
    name: "companyName",
    placeholder: "Company",
    hasError: (form: any) => !!form.formState.errors.companyName,
    isRequired: true,
    showRequiredLabel: true,
    translationKey: "userProfile",
    type: "text",
    showLetterCount: true,
    maxLength: 20,
  },
  {
    name: "jobTitle",
    placeholder: "Position",
    hasError: (form: any) => !!form.formState.errors.companyName,
    showRequiredLabel: true,
    translationKey: "userProfile",
    type: "text",
    showLetterCount: true,
    maxLength: 30,
  },
  {
    name: "startDate",
    isGroup: true,
    groupname: "date",
    type: "date",
    childField: [
      {
        name: "startDateYear",
        placeholder: "Year",
        hasError: (form: any) => !!form.formState.errors.startDateYear,
        translationKey: "userProfile",
        showRequiredLabel: false,
      },
      {
        name: "startDateMonth",
        placeholder: "Month",
        hasError: (form: any) => !!form.formState.errors.startDateMonth,
        translationKey: "userProfile",
        showRequiredLabel: false,
      },
    ],
  },
  {
    name: "endDate",
    isGroup: true,
    groupname: "date",
    type: "date",
    childField: [
      {
        name: "endDateYear",
        placeholder: "Year",
        hasError: (form: any) => !!form.formState.errors.startDateYear,
        translationKey: "userProfile",
        showRequiredLabel: false,
      },
      {
        name: "endDateMonth",
        placeholder: "Month",
        hasError: (form: any) => !!form.formState.errors.startDateMonth,
        translationKey: "userProfile",
        showRequiredLabel: false,
      },
    ],
  },
  {
    name: "currentlyWork",
    hasError: (form: any) => !!form.formstate.errors.currentlyWork,
    translationKey: "userProfile",
    showRequiredLabel: false,
    type: "checkbox",
  },
  {
    name: "description",
    placeholder: "Job Description - Please describe your role in this job.",
    hasError: (form: any) => !!form.formState.errors.companyName,
    showRequiredLabel: true,
    translationKey: "userProfile",
    type: "textArea",
    showLetterCount: true,
    maxLength: 250,
  },
];

const generateJobFields = (jobId: number) => {
  return [
    {
      name: `companyName_${jobId}`, // Unique name for each job
      placeholder: "Company",
      hasError: (form: any) => !!form.formState.errors[`companyName_${jobId}`],
      isRequired: true,
      showRequiredLabel: true,
      translationKey: "userProfile",
      type: "text",
      showLetterCount: true,
      maxLength: 20,
    },
    {
      name: `jobTitle_${jobId}`,
      placeholder: "Position",
      hasError: (form: any) =>
        !!form.formState.errors.errors[`jobTitle_${jobId}`],
      showRequiredLabel: true,
      translationKey: "userProfile",
      type: "text",
      showLetterCount: true,
      maxLength: 20,
    },
    {
      name: `startDate_${jobId}`,
      isGroup: true,
      groupname: "date",
      type: "date",
      childField: [
        {
          name: `startDateYear_${jobId}`,
          placeholder: "Year",
          hasError: (form: any) =>
            !!form.formState.errors[`startDateYear_${jobId}`],
          translationKey: "userProfile",
          showRequiredLabel: false,
        },
        {
          name: `startDateMonth_${jobId}`,
          placeholder: "Month",
          hasError: (form: any) =>
            !!form.formState.errors[`startDateMonth_${jobId}`],
          translationKey: "userProfile",
          showRequiredLabel: false,
        },
      ],
    },
    {
      name: `endDate_${jobId}`,
      isGroup: true,
      childField: [
        {
          name: `endDateYear_${jobId}`,
          placeholder: "Year",
          hasError: (form: any) =>
            !!form.formState.errors[`endDateYear_${jobId}`],
          translationKey: "userProfile",
          showRequiredLabel: false,
        },
        {
          name: `endDateMonth_${jobId}`,
          placeholder: "Year",
          hasError: (form: any) =>
            !!form.formState.errors[`endDateMonth_${jobId}`],
          translationKey: "userProfile",
          showRequiredLabel: false,
        },
      ],
    },
    {
      name: `currentlyWork_${jobId}`,
      label: "I currently work here",
      translationKey: "userProfile",
      type: "checkbox",
    },
    {
      name: `description_${jobId}`,
      placeholder: "Job Description - Please describe your role in this job.",
      hasError: (form: any) => !!form.formState.errors[`description_${jobId}`],
      showRequiredLabel: true,
      translationKey: "userProfile",
      type: "textArea",
      showLetterCount: true,
      maxLength: 250,
    },
  ];
};

export default generateJobFields;
