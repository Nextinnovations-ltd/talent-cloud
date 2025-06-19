import { createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/home/Home";
import routesMap from "./constants/routesMap";
import { AuthLayout } from "./layouts/AuthLayout";
import { Login } from "./pages/authentication/login/Login";
import { SignUp } from "./pages/authentication/signup/SignUp";
import { ForgetPassword } from "./pages/authentication/forgetPassword/ForgetPassword";
import { ResetPassword } from "./pages/authentication/resetPassword/ResetPassword";
import { VerifyUser } from "./pages/authentication/verifyUser/VerifyUser";
import { NotFound } from "./pages/errors/404";
import { VerifyToken } from "./components/common/VerifyToken";
import { VerifyEmail } from "./pages/authentication/verifyEmail/VerifyEmail";
import { CreateUsername } from "./pages/createUsername/CreateUsername";
import { Userwelcome } from "./pages/userwelcome/Userwelcome";
import { ProfileNavSideBar } from "./pages/profile/Profile";
import { ProfileUser } from "./pages/profile/ProfileUser";
import { WorkExperience } from "./pages/profile/subPages/WorkExperience";
import { Education } from "./pages/profile/subPages/Education";
import { Skills } from "./pages/profile/subPages/Skills";
import { Certification } from "./pages/profile/subPages/Certification";
import { RedirectLoading } from "./pages/authentication/redirectLoading/RedirectLoading";
import { ParsingTokenLayout } from "./layouts/ParsingTokenLayout";
import { Language } from "./pages/profile/subPages/Language";
import { SocialLinks } from "./pages/profile/subPages/SocialLinks";
import { MainUserProfile } from "./pages/profile/MainUserProfile";
import LandingPage from "./pages/landingPage/LandingPage";
import { MainLayout } from "./layouts/MainLayout";
import ApplyJob from "./pages/applyjobs";


export const router = createBrowserRouter([
  {
   path:"/lg",
   element:<LandingPage/>
  },
  {
    path: "/",
   element: <MainLayout />,


    children: [
      {
        path: "/",
        element: <VerifyToken shouldSkip={false} />,
        children: [
          {
            index: true,
            element: <Home />,
          },
         
          {
            path: "/user",
            children: [
              {
                path: routesMap.mainProfile.path,
                element: <MainUserProfile />
              },
              {
                path: 'job_apply',
                element: <ApplyJob />
              },
            ]


          },
          {
            path: "/user/edit",
            element: <ProfileNavSideBar />, // ProfileUserNav acts as the layout for user routes
            children: [
              {
                path: routesMap.profile.path,
                element: <ProfileUser />,
              },
              {
                path: routesMap.workExperience.path,
                element: <WorkExperience />,
              },
              {
                path: routesMap.education.path,
                element: <Education />,
              },
              {
                path: routesMap.socialLinks.path,

                element: <SocialLinks />
              },
              {
                path: routesMap.skill.path,
                element: <Skills />,
              },
              {
                path: routesMap.certification.path,
                element: <Certification />,
              },
              {
                path: routesMap.languages.path,
                element: <Language />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: `/${routesMap.verify.path}`,
    element: <AuthLayout />,
    children: [
      {
        path: `/${routesMap.verify.path}`,
        element: <VerifyToken shouldSkip={false} />,
        children: [
          {
            index: true,
            element: <CreateUsername />,
          },
          {
            path: routesMap.userWelcome.path,
            element: <Userwelcome />,
          },
        ],
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: routesMap.login.path,
        element: <Login />,
      },
      {
        path: routesMap.signup.path,
        element: <SignUp />,
      },
      {
        path: routesMap.verifyEmail.path,
        element: <VerifyEmail />,
      },
      {
        path: routesMap.forgetPassword.path,
        element: <ForgetPassword />,
      },
      {
        path: routesMap.resetPassword.path,
        element: <ResetPassword />,
      },
      {
        element: <VerifyToken shouldSkip={false} />,
        children: [
          {
            path: routesMap.verifyEmail.path,
            element: <VerifyUser />,
          },
        ],
      },
    ],
  },
  {
    path: "/oauth/callback",
    element: <ParsingTokenLayout />,
    children: [
      {
        index: true,
        element: <RedirectLoading />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
