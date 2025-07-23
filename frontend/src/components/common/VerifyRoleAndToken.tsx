import { Outlet } from "react-router-dom";


 const VerifyRoleAndToken = ({shouldSkip}:{shouldSkip:boolean}) => {

    if(shouldSkip) {
        return <Outlet/>
    }

  return (
    <div>VerifyRoleAndToken</div>
  )
}

export default VerifyRoleAndToken;