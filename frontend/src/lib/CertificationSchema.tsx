import * as yup from "yup";

export const CertificationYupSchema = yup.object({
  certificationName: yup.string().required("Name of Certification is required"),
  organizationIssue: yup.string().required("Issuing Organization is required"),
  issueYear: yup.string().required("Issue Date is required"),
  issueMonth: yup.string().required("Issue Date is required"),
  expirationYear: yup.string().required("Expiration Date is required"),
  expirationMonth: yup.string().required("Expiration Month is required"),
  noExpired: yup.boolean().required(),
  credentialId: yup.string().required("Credential ID is required"),
  credentialURL: yup.string().required("Credential URL is required"),
});
