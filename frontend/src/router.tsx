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

import { MainLayout } from "./layouts/MainLayout";
import ApplyJob from "./pages/applyjobs";
import OrganizationDetail from "./pages/organizationDetail/OrganizationDetail";
import JobSeekerLandingPage from "./pages/LandingPages/JobSeekerLandingPage";
import SelectedProject from "./pages/profile/subPages/SelectedProject";
import VideoIntroduction from "./pages/profile/subPages/VideoIntroduction";
import SpecailSkills from "./pages/profile/subPages/SpecailSkills";
import AppliedJobs from "./pages/appliedJobs";
import SavedJobs from "./pages/savedJobs";
import Index from "./components/superAdmin";
import ExpiredJobsDetail from "./pages/expiredJobsDetail/expiredJobsDetail";
import adminRoutesMap from "./constants/adminRoutesMap";
import AdminLogin from "./pages/authentication/adminAuthentication/login/Login";
import AdminLayout from "./layouts/AdminLayout";
import VerifyRoleAndToken from "./components/common/VerifyRoleAndToken";
import AnalyticalPage from "./pages/admin/Analytical/analyticalPage";
import Candidates from "./pages/admin/Candidates/Candidates";
import AllJobs from "./pages/admin/AllJobs/AllJobs";
import ActiveJobs from "./pages/admin/ActiveJobs/ActiveJobs";
import ExpiredJobs from "./pages/admin/ExpiredJobs/ExpiredJobs";



export const router = createBrowserRouter([
  {
    path: "/test-design",
    element: <Index/>
  },
  {
   path:"/jobseeker/lp",
   element:<JobSeekerLandingPage/>
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
                path: routesMap.appliedJobs.path,
                element: <AppliedJobs />
              },
              {
                path: routesMap.savedJobs.path,
                element: <SavedJobs />
              },
              {
                path: routesMap.expiredJobDetails.path,
                element: <ExpiredJobsDetail />
              },
              {
                path: 'job_apply/:id',
                element: <ApplyJob />
              },
            ]


          },
          {
            path: "/organization",
            children: [
              {
                path: 'detail/:id',
                element: <OrganizationDetail />
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
              {
                path:routesMap.selectedProjects.path,
                element:<SelectedProject/>
              },
              {
                path:routesMap.videoIntroduction.path,
                element:<VideoIntroduction/>
              },
              {
                path:routesMap.specialSkills.path,
                element:<SpecailSkills/>
              }
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
    path:"/admin",
    element: <AdminLayout/>,
    children:[
      {
        path:'dashboard',
        element:<VerifyRoleAndToken shouldSkip={true}/>,
        children:[
          {
            index:true,
            element:<AnalyticalPage/>
          },
          {
            path:adminRoutesMap?.candiates.path,
            element:<Candidates/>
          },
          {
            path:adminRoutesMap?.allJobs.path,
            element:<AllJobs/>
          },
          {
            path:adminRoutesMap?.activeJobs.path,
            element:<ActiveJobs/>
          },
          {
            path:adminRoutesMap?.expiredJobs.path,
            element:<ExpiredJobs/>
          }
        ]

      },
    ]
  },

  {
    path:"/admin/auth",
    element:<AuthLayout/>,
    children:[
      {
        path:adminRoutesMap.login.path,
        element:<AdminLogin/>
      }
    ]
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
