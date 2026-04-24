import routesMap from "@/constants/routesMap";
import useVerifyToken from "@/hooks/useVerifyToken";
import { useGetUserInfoQuery } from "@/services/api/userSlice";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import ROLES from "@/constants/authorizations";

export const VerifyToken = ({ shouldSkip }: { shouldSkip: boolean }) => {
  const { hasToken, isTokenVerifying, isSucceedTokenVerifying } = useVerifyToken(shouldSkip);
  const location = useLocation();
  const navigate = useNavigate();

  const {
    data: userInfo,
    isLoading: isLoadingUserInfo,
    isSuccess,
  } = useGetUserInfoQuery(undefined, {
    skip: !hasToken || isTokenVerifying || !isSucceedTokenVerifying,
  });

  //1,2,3,4,5
  //25 * 5 125


  useEffect(() => {
    if (!hasToken && !isTokenVerifying) {
      navigate(`/emp/lp`, {
        state: { from: location.pathname },
        replace: true,
      });
    }
    if (isSuccess) {
      const { is_generated_username, onboarding_step, role } = userInfo?.data || {};


      if (role === ROLES.SUPERADMIN) {
        navigate("/admin/dashboard", { replace: true });
        return;
      }

     if (is_generated_username) {
        navigate("/verify");
        return;
      }

      if (onboarding_step && onboarding_step !== 5 && !is_generated_username) {
      if(onboarding_step == 1){
        navigate(
          `/verify/${routesMap.userWelcome.path}`
        );
      }else{
        navigate(
          `/verify/${routesMap.userWelcome.path}?step=${onboarding_step + 1}`
        );
      }
      }

      if (onboarding_step === 6) {
        navigate("/");
      }
    }
  }, [hasToken, isLoadingUserInfo, isSuccess, isTokenVerifying, location.pathname, navigate, userInfo?.data]);

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

  // Render nested routes only when authenticated and user info loaded
  if (hasToken && isSuccess) {
    return <Outlet />;
  }

  // Fallback spinner while redirect fires
  return (
    <div className="flex items-center flex-col justify-center h-[100svh] bg-slate-100">
      <LoadingSpinner />
      <p>Loading...</p>
    </div>
  );
};

export default VerifyToken;
