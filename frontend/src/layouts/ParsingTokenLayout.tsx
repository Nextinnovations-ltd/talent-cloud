/* eslint-disable @typescript-eslint/ban-ts-comment */
import routesMap from "@/constants/routesMap";
import {
  removeTokenFromSessionStorage,
  removeTokensFromLocalStorage,
  setTokenToLocalStorage,
} from "@/helpers/operateBrowserStorage";
import { RedirectLoading } from "@/pages/authentication/redirectLoading/RedirectLoading";
import {
  setReauthToken,
  useVerifyOAuthTokenMutation,
} from "@/services/slices/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

export const ParsingTokenLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [verifyToken, { isLoading }] = useVerifyOAuthTokenMutation();

  useEffect(() => {
    const processToken = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get("token");
      // const isGeneratedUsername = params.get("is_generated_username");

      if (token) {
        console.log({token})
        try {
          const response = await verifyToken({ token }).unwrap();

          

           //@ts-ignore
          const isGeneratedUsername = response?.data?.is_generated_username;
           //@ts-ignore
          const role = response?.data?.role;
           //@ts-ignore
          const onBoarding = response?.data?.onboarding_step;


          console.log({response})

          removeTokenFromSessionStorage();
          removeTokensFromLocalStorage();

           //@ts-ignore
          dispatch(setReauthToken(response?.data?.token));

           //@ts-ignore
          setTokenToLocalStorage(response?.data.token);

          if (isGeneratedUsername) {
            navigate("/verify");
            return;
          }
    
          if (role && onBoarding) {
            navigate(
              `/verify/${routesMap.userWelcome.path}?step=${onBoarding + 1}`,
              { replace: true }
            );
            return;
          }
    
          navigate("/");
        } catch (error) {
          console.error("Error processing token:", error);
          navigate("/auth/login");
        }
      }
    };

    processToken();
  }, [dispatch, location, navigate, verifyToken]);

  if (isLoading) return <RedirectLoading />;

  return <Outlet />;
};
