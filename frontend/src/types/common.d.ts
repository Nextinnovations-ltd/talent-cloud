type NavLinkType = {
  title: string;
  to: string;
};

type SocialButtonType = {
  title: string;
  icon: ReactNode;
  handleClick:any;
  loading:boolean
};

type PrimaryButtonProps = {
  title: string;
  isButtonDisabled: boolean;
  loading?: boolean;
  handleClick?: any;
  width?: any;
};

type FieldDataType = {
  fieldName: string;
  placeholder: string;
  isError: (form: any) => boolean;
  required: boolean;
  requiredLabel: boolean;
  languageName: string;
  type: string;
  showPasswordIcon: ReactNode | null;
  hidePasswordIcon: ReactNode | null;
  showLetterCount?: boolean; // New prop to show/hide letter count
  maxLength?: number;
  description?: boolean;
  descriptionText?: string;
  height?: string;
};

type SocialLinkFieldType = {
  fieldName: string;
  isError: (form: any) => boolean;
  startIcon: any;
  height?: string;
  languageName: string;
  placeholder:string
};
