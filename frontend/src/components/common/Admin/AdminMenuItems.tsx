import { useLocation, useNavigate } from "react-router-dom";

interface AdminMenuItemsProps {
  icon: React.ReactNode;
  text: string;
  targetPath: string;
  exactMatch?: boolean;
}

const AdminMenuItems = ({ 
  icon, 
  text, 
  targetPath,
  exactMatch = false 
}: AdminMenuItemsProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  
  const isActive = exactMatch
    ? pathname === targetPath
    : pathname.startsWith(targetPath);

  return (
    <div
      onClick={() => navigate(targetPath)}
      className={`px-[20px] h-[38px] duration-500 cursor-pointer font-semibold flex items-center justify-start gap-[24px] hover:bg-[#3699F069] rounded-[6px] hover:text-[#0481EF] ${
        isActive ? 'bg-[#3699F069] text-[#0481EF]' : 'text-[#575757]'
      }`}
      role="button"
      aria-current={isActive ? "page" : undefined}
    >
      {icon}
      <p>{text}</p>
    </div>
  );
};

export default AdminMenuItems;