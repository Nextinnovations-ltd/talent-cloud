import routesMap from "@/constants/routesMap";
import useVerifyToken from "@/hooks/useVerifyToken";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const ProtectRoute = ({ children }: { children: React.ReactNode }) => {
  const { hasToken: isAuthenticated, isGeneratedUsername } = useVerifyToken();

  // const { verifyToken }  = useVerifyToken();
  const location = useLocation();
  const navigate = useNavigate();


  useEffect(() => {
    const checkAuthentication = async () => {
      // await verifyToken();
      if (!isAuthenticated) {
        navigate(`/auth/${routesMap.login.path}`, {
          state: { from: location.pathname },
        });
      } 
    };

    checkAuthentication();
  }, [isAuthenticated, isGeneratedUsername]);

  if (!isAuthenticated) {
    return null;
  }

  return children;
};

export default ProtectRoute;
