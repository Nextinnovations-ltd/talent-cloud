import routesMap from "@/constants/routesMap";
import useVerifyToken from "@/hooks/useVerifyToken";
import { useGetUserInfoQuery } from "@/services/api/userSlice";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

export const VerifyToken = ({ shouldSkip }: { shouldSkip: boolean }) => {
  const { hasToken, isTokenVerifying } = useVerifyToken(shouldSkip);
  const location = useLocation();
  const navigate = useNavigate();

  const {
    data: userInfo,
    isLoading: isLoadingUserInfo,
    isSuccess,
    refetch,
  } = useGetUserInfoQuery(undefined, { refetchOnMountOrArgChange: true });


  const role =  userInfo?.data?.role
  

  //role must be user
  console.log(role)


  useEffect(() => {
    if (!hasToken && isTokenVerifying) {
      navigate(`/auth/${routesMap.login.path}`, {
        state: { from: location.pathname },
        replace: true,
      });
    }
    if (isSuccess) {
      const { is_generated_username, onboarding_step, role } = userInfo?.data || {};

      if (role === "superadmin") {
        navigate("/", { replace: true });
        return;
      }

      if (is_generated_username) {
        navigate("/verify");
        return;
      }

      if (onboarding_step && onboarding_step !== 5 && !is_generated_username) {
        navigate(
          `/verify/${routesMap.userWelcome.path}?step=${onboarding_step + 1}`,
          { replace: true }
        );
      }

      if (onboarding_step === 6) {
        navigate("/");
      }
    }

    refetch();
  }, [isLoadingUserInfo]);

  if (shouldSkip) {
    return <Outlet />;
  }

  if (isTokenVerifying || isLoadingUserInfo) {
    return (
      <div className="flex items-center flex-col justify-center h-[100svh] bg-slate-100">
        <LoadingSpinner />
        <p>Loading...</p>
      </div>
    );
  }

  // Render nested routes
  return <Outlet />;
};

export default VerifyToken;
