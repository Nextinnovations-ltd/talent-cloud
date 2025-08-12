import * as yup from "yup";

export const CertificationYupSchema = yup.object({
  certificationName: yup.string().required("Name of Certification is required"),
  organizationIssue: yup.string().required("Issuing Organization is required"),
  issueYear: yup.string().required("Issue Date is required"),
  issueMonth: yup.string().required("Issue Date is required"),
  expirationYear: yup.string().when("noExpired", (noExpired, schema) => {
    if (!noExpired) return schema.required("Expiration Date is required");
    return schema;
  }),
  expirationMonth: yup.string().when("noExpired", (noExpired, schema) => {
    if (!noExpired) return schema.required("Expiration Month is required");
    return schema;
  }),
  noExpired: yup.boolean().required(),
  credentialURL: yup.string().required("Credential URL is required"),
}).test(
  "end-date-after-start-date",
  "End date cannot be earlier than start date.",
  function (value) {
    const { noExpired, issueYear, issueMonth, expirationYear, expirationMonth } = value || {};
    if (noExpired) return true;
    if (!issueYear || !issueMonth || !expirationYear || !expirationMonth) return true;
    const start = new Date(Number(issueYear), Number(issueMonth) - 1);
    const end = new Date(Number(expirationYear), Number(expirationMonth) - 1);
    return end >= start;
  }
);
