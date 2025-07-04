import {
  BehenceIcon,
  FaceBookIcon,
  GitHubIcon,
  LinkedInIcon,
  PortfolioIcon,
} from "@/constants/socialSvgs";



export const socialLinkFields: SocialLinkFieldType[] = [
  {
    fieldName: "facebook_url",
    isError: (form: any) => !!form.formState.errors.displayName,
    startIcon: <FaceBookIcon />,
    languageName: "userProfile",
  },
  {
    fieldName: "linkedin_url",
    isError: (form: any) => !!form.formState.errors.displayName,
    startIcon: <LinkedInIcon />,
    languageName: "userProfile",
  },
  {
    fieldName: "github_url",
    isError: (form: any) => !!form.formState.errors.displayName,
    startIcon: <GitHubIcon />,
    languageName: "userProfile",
  },
  {
    fieldName: "behance_url",
    isError: (form: any) => !!form.formState.errors.displayName,
    startIcon: <BehenceIcon />,
    languageName: "userProfile",
  },
  {
    fieldName: "portfolio_url",
    isError: (form: any) => !!form.formState.errors.displayName,
    startIcon: <PortfolioIcon />,
    languageName: "userProfile",
  },
];
