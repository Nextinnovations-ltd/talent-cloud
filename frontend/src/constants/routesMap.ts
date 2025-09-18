import RoutesMap from "@/types/routes-types";

const routesMap: RoutesMap = {
  home: {
    path: "",
    name: "Home",
  },
  dashboard: {
    path: "dashboard",
    name: "Dashboard",
  },
  login: {
    path: "login",
    name: "Login",
  },
  signup: {
    path: "signup",
    name: "Signup",
  },
  forgetPassword: {
    path: "forgetpassword",
    name: "Forget Password",
  },
  resetPassword: {
    path: "reset-password",
    name: "Reset Password",
  },
  verifyEmail: {
    path: "verifyemail",
    name: "Verify Email",
  },
  logout: {
    path: "logout",
    name: "Logout",
  },
  createUsername: {
    path: "create-username",
    name: "Create Username",
  },
  verify: {
    path: "verify",
    name: "verify",
  },
  userWelcome: {
    path: "userwelcome",
    name: "userwelcome",
  },
  mainProfile: {
    path: "mainProfile",
    name: "mainProfile",
  },
  profile: {
    path: "profile",
    name: "profile",
  },
  workExperience: {
    path: "workexperience",
    name: "Experience",
  },
  selectedProjects:{
    path:"selectedProjects",
    name:'selectedProjects'
  }
  ,
  education: {
    path: "education",
    name: "education",
  },
  videoIntroduction:{
    path:"video-introduction",
    name:"video-introduction"
  },
  socialLinks: {
    path: "sockial-links",
    name: "socialLinks",
  },
  skill: {
    path: "skills",
    name: "skills",
  },
  languages: {
    path: "languages",
    name: "languages",
  },
  certification: {
    path: "certifications",
    name: "certifications",
  },
  redirectLoading: {
    path: "redirectLoading",
    name: "redirectLoading",
  },
  specialSkills:{
   path:"specialSkills",
   name:"specialSkills"
  },
  appliedJobs:{
   path:"applied-jobs",
   name:"appliedJobs"
  },
  savedJobs:{
    path:"saved-jobs",
    name:"savedJobs"
  },
  expiredJobDetails:{
    path:"expiredJobDetails/:id",
    name:"expiredJobDetails"
  },
  resume:{
    path:"resume",
    name:"resume"
  }
};

// verify/create-username

export default routesMap;
