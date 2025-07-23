/* eslint-disable @typescript-eslint/no-explicit-any */

interface AdminMenuItemsProps {
  icon: any;
  text: string;
  isActive?: boolean;
}

const AdminMenuItems = ({ icon, text, isActive = false }: AdminMenuItemsProps) => {
  return (
    <div className={`px-[20px] h-[38px] duration-500 cursor-pointer font-semibold flex items-center justify-start gap-[24px] hover:bg-[#3699F069] rounded-[6px] hover:text-[#0481EF] ${isActive ? 'bg-[#3699F069] text-[#0481EF]' : 'text-[#575757]'}`}>
     {icon}
      <p>{text}</p>
    </div>
  );
};

export default AdminMenuItems;