import { Outlet, useNavigate } from "react-router-dom";
import { useGetUserInfoQuery } from "@/services/api/userSlice";
import useVerifyToken from "@/hooks/useVerifyToken";
import { useEffect } from "react";
import routesMap from "@/constants/routesMap";
import { LoadingSpinner } from "./LoadingSpinner";
import ROLES from "@/constants/authorizations";


const VerifyRoleAndToken = ({ shouldSkip }: { shouldSkip: boolean }) => {
    const { hasToken, isTokenVerifying, isSucceedTokenVerifying } = useVerifyToken();
    const {
        data: userInfo,
        isLoading: isLoadingUserInfo,
        isSuccess: isUserInfoSuccess
    } = useGetUserInfoQuery(undefined, {
        skip: shouldSkip || isTokenVerifying || !isSucceedTokenVerifying,
    });

    const navigate = useNavigate();
    const role = userInfo?.data?.role;


    useEffect(() => {
        // Redirect to login if no token (and token verification is complete)
        if (!hasToken && !isTokenVerifying) {
            navigate(`/auth/${routesMap.login.path}`, {
                state: { from: location.pathname },
                replace: true,
            });
            return;
        }

        // Redirect to home if user is not superAdmin (and data is loaded)
        if (isUserInfoSuccess && role !== ROLES.SUPERADMIN) {
            navigate("/", { replace: true });
        }
    }, [hasToken, isTokenVerifying, isUserInfoSuccess, navigate, role]);

    // Show loading spinner while any verification is in progress
    if (isTokenVerifying || isLoadingUserInfo) {
        return <div className="w-[100svw] h-[100svh] flex items-center justify-center">
            <LoadingSpinner />
        </div>; // Replace with your loading component
    }

    // Only render Outlet if ALL conditions are met:
    // 1. Token verification succeeded
    // 2. User info is loaded
    // 3. User is superAdmin
    if (hasToken && isUserInfoSuccess && role === ROLES.SUPERADMIN) {
        return <Outlet />;
    }

    // Default fallback (while redirects are happening)
    return <div className="w-[100svw] h-[100svh] flex items-center justify-center">
        <LoadingSpinner />
    </div>; // Replace with your loading component;
};

export default VerifyRoleAndToken;