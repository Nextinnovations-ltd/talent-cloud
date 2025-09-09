export const nameFields: FieldDataType[] = [
  {
    fieldName: "name",
    placeholder: "Enter your full name",
    isError: (form: any) => !!form.formState.errors.name,
    required:  true,
    requiredLabel: true,
    languageName: "stepTwo",
    type: "text",
    showPasswordIcon: null,
    hidePasswordIcon: null,
    maxLength: 50
  },
  {
    fieldName:"tagline",
    placeholder:"eg. Frontend Developer Lead at Google",
    isError:(form:any)=>!!form.formState.errors.name,
    required:true,
    requiredLabel:true,
    languageName:"stepTwo",
    type:"text",
    showPasswordIcon:null,
    hidePasswordIcon:null,
    description:true,
    descriptionText:"The community will see job title after your name",
    maxLength: 50
  }
];

export const phoneNumberFields:FieldDataType[] = [
  {
    fieldName:"phone",
    placeholder:"123456789",
    isError:(form:any)=>!!form.formState.errors.name,
    required:false,
    requiredLabel:false,
    languageName:'stepTwo',
    type:"text",
    showPasswordIcon:null,
    hidePasswordIcon:null
  }
]

export const dateOFBirthFields: FieldDataType[] = [
  {
    fieldName: "month",
    placeholder: "MM",
    isError: (form: any) => !!form.formState.errors.month,
    required: false,
    requiredLabel: false,
    languageName: "stepTwo",
    type: "text",
    showPasswordIcon: null,
    hidePasswordIcon: null,
  },
  {
    fieldName: "day",
    placeholder: "DD",
    isError: (form: any) => !!form.formState.errors.day,
    required: false,
    requiredLabel: false,
    languageName: "stepTwo",
    type: "text",
    showPasswordIcon: null,
    hidePasswordIcon: null,
  },
  {
    fieldName: "year",
    placeholder: "YYYY",
    isError: (form: any) => !!form.formState.errors.year,
    required: false,
    requiredLabel: false,
    languageName: "stepTwo",
    type: "text",
    showPasswordIcon: null,
    hidePasswordIcon: null,
  },
];

export const addressFields: FieldDataType[] = [
  {
    fieldName: "address",
    placeholder: "Enter your address",
    isError: (form: any) => !!form.formState.errors.address,
    required: false,
    requiredLabel: true,
    languageName: "stepTwo",
    type: "text",
    showPasswordIcon: null,
    hidePasswordIcon: null,
  },
];
