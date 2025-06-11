import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import usePreferenceState from "./state/zustand/preference";

//auth
import enAuth from "./locales/en/auth.json";
import mmAuth from "./locales/mm/auth.json";

//forgot password
import enForgotPassword from "./locales/en/forgotPassword.json";
import mmForgotPassword from "./locales/mm/forgotPassword.json";

//verify email
import enVerifyEmail from "./locales/en/verifyEmail.json";
import mmVerifyEmail from "./locales/mm/verifyEmail.json";

//reset password
import enResetPassowrd from "./locales/en/resetPassword.json";
import mmResetPassowrd from "./locales/mm/resetPassword.json";

//create username
import enUsername from "./locales/en/create-username.json";
import mmUsername from "./locales/mm/create-username.json";

//step two
import enStepTwo from "./locales/en/stepTwo.json";
import mmStepTwo from "./locales/mm/stepTwo.json";

//user profile
import enUserProfile from "./locales/en/userProfile.json";
import mmUserProfile from "./locales/mm/userProfile.json";

const resources = {
  en: {
    auth: enAuth,
    forgotPassword: enForgotPassword,
    verifyEmail: enVerifyEmail,
    resetPassword: enResetPassowrd,
    createUsername: enUsername,
    stepTwo: enStepTwo,
    userProfile: enUserProfile,
  },
  mm: {
    auth: mmAuth,
    forgotPassword: mmForgotPassword,
    verifyEmail: mmVerifyEmail,
    resetPassword: mmResetPassowrd,
    createUsername: mmUsername,
    stepTwo: mmStepTwo,
    userProfile: mmUserProfile,
  },
};

const defaultLanguage = usePreferenceState.getState().selectedLanguage || "mm";

i18next.use(initReactI18next).init({
  resources: resources,
  lng: defaultLanguage,
  fallbackLng: defaultLanguage,
  debug: true,
});
