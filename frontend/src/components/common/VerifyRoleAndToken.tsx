import useVerifyToken from "@/hooks/useVerifyToken";
import { useNavigate, Outlet } from "react-router-dom";
import adminRoutesMap from "@/constants/adminRoutesMap";
import { LoadingSpinner } from "./LoadingSpinner";
import { useGetUserInfoQuery } from "@/services/api/userSlice";



 const VerifyRoleAndToken = ({shouldSkip}:{shouldSkip:boolean}) => {

  const { hasToken, isTokenVerifying,isSucceedTokenVerifying } = useVerifyToken(shouldSkip);

  const navigate = useNavigate();





 // rule must be superadmin
console.log(hasToken,isTokenVerifying)




    if (shouldSkip) {
        return <Outlet />;
    }

    if (isTokenVerifying) {
        return (
            <div className="flex fixed top-0 left-0 right-0 bottom-0 items-center flex-col justify-center z-[10000] h-[100svh] bg-slate-100">
                <LoadingSpinner />
                <p>Loading...</p>
            </div>
        );
    }

    // If no token or not superadmin, redirect to admin login
    if (!hasToken) {
        navigate(`/admin/auth/${adminRoutesMap.login.path}`, { replace: true });
        return null;
    }

    return <Outlet />;
}

export default VerifyRoleAndToken;