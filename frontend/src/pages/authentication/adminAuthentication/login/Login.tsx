import { adminLogin } from "@/assets/images";
import AdminLoginForm from "./AdminLoginForm";


 const AdminLogin = () => {
  return (
    <div className="flex h-[100svh] overflow-hidden items-center justify-center">
       <div className="w-[50%] "> <img src={adminLogin}/></div>
        <div className="w-[50%]">
            <AdminLoginForm/>
        </div>
    </div>
  )
}


export default AdminLogin;
