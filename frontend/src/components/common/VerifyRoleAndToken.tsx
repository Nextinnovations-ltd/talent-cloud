import useVerifyToken from "@/hooks/useVerifyToken";
import { useGetUserInfoQuery } from "@/services/api/userSlice";
import { useNavigate, useLocation, Outlet } from "react-router-dom";


 const VerifyRoleAndToken = ({shouldSkip}:{shouldSkip:boolean}) => {

  const { hasToken, isTokenVerifying } = useVerifyToken(shouldSkip);
  const location = useLocation();
  const navigate = useNavigate();

  const {
    data: AdminInfo,
    error,
    isSuccess,
  } = useGetUserInfoQuery(undefined, { refetchOnMountOrArgChange: true });

  
  console.log("--------------")
  console.log(AdminInfo,isSuccess,hasToken,error)
  console.log("--------------")


    if(shouldSkip) {
        return <Outlet/>
    }

    return <Outlet/>
}

export default VerifyRoleAndToken;