/* eslint-disable @typescript-eslint/no-explicit-any */
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
    placeholder:"www.facebook.com"
  },
  {
    fieldName: "linkedin_url",
    isError: (form: any) => !!form.formState.errors.displayName,
    startIcon: <LinkedInIcon />,
    languageName: "userProfile",
     placeholder:"www.linkedIn.com"
  },
  {
    fieldName: "github_url",
    isError: (form: any) => !!form.formState.errors.displayName,
    startIcon: <GitHubIcon />,
    languageName: "userProfile",
     placeholder:"www.github.com"
  },
  {
    fieldName: "behance_url",
    isError: (form: any) => !!form.formState.errors.displayName,
    startIcon: <BehenceIcon />,
    languageName: "userProfile",
    placeholder:"www.behance.com"
  },
  {
    fieldName: "portfolio_url",
    isError: (form: any) => !!form.formState.errors.displayName,
    startIcon: <PortfolioIcon />,
    languageName: "userProfile",
    placeholder:"www.profile.com"
  },
];
