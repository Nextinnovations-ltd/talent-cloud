type Route = {
  path: string;
  name: string;
};

type RoutesMap = {
  home: Route;
  dashboard: Route;
  login: Route;
  signup: Route;
  forgetPassword: Route;
  resetPassword: Route;
  verifyEmail: Route;
  logout: Route;
  createUsername: Route;
  verify: Route;
  userWelcome: Route;
  profile: Route;
  workExperience: Route;
  education: Route;
  skill: Route;
  languages: Route;
  certification: Route;
  redirectLoading: Route;
  socialLinks: Route;
  mainProfile: Route;
  selectedProjects:Route;
  videoIntroduction:Route;
  specialSkills:Route;
  appliedJobs:Route;
  savedJobs:Route;
  expiredJobDetails:Route
};

export default RoutesMap;
