import { adminLogin, adminLoginHalf } from "@/assets/images";
import AdminLoginForm from "./AdminLoginForm";

const AdminLogin = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Left side with image */}
      <div className="w-full md:w-1/2 h-64 md:h-auto">
        <img src={adminLogin} className="w-full h-full object-cover" alt="Admin" />
      </div>

      {/* Right side with background and form */}
      <div
        className="w-full md:w-1/2 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${adminLoginHalf})` }}
      >
        <div className="w-full max-w-md p-6 bg-transparent rounded">
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
