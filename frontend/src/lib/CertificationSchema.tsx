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
});
