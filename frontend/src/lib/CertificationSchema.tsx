import * as yup from "yup";

export const CertificationYupSchema = yup.object({
  certificationName: yup.string().required("Name of Certification is required"),
  organizationIssue: yup.string().required("Issuing Organization is required"),
  issueYear: yup.string().required("Issue Date is required"),
  issueMonth: yup.string().required("Issue Date is required"),
  noExpired: yup.boolean().required("Expiration status is required"),

  expirationYear: yup.string().when('noExpired', {
    is: false,
    then: (schema) => schema.required("Expiration Year is required"),
    otherwise: (schema) => schema.optional(),
  }),

  expirationMonth: yup.string().when('noExpired', {
    is: false,
    then: (schema) => schema.required("Expiration Month is required"),
    otherwise: (schema) => schema.optional(),
  }),

  credentialURL: yup.string().url("Credential URL must be a valid URL"),
}).test(
  "end-date-after-start-date",
  "Expiration Date must be later than Issued Date",
  function (value) {
    const { noExpired, issueYear, issueMonth, expirationYear, expirationMonth } = value || {};
    
    if (noExpired) return true;
    
    // If any of the dates are missing, skip validation
    if (!issueYear || !issueMonth || !expirationYear || !expirationMonth) return true;
    
    const start = new Date(Number(issueYear), Number(issueMonth) - 1);
    const end = new Date(Number(expirationYear), Number(expirationMonth) - 1);
    
    // Ensure end date is strictly after start date
    return end > start;
  }
);
