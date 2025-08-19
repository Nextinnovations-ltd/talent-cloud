import { FC } from "react";
import { useNavigate } from "react-router-dom";
import upArrow from "@/assets/JobPortal/arrow-up-left.svg";

interface CommonButtonProps {
  title?: string;         // Text to display (optional — defaults applied below)
  smallIcon?: boolean;    // Whether to use small icon size
  login?: boolean;        // Whether button navigates to login
}

const CommonButton: FC<CommonButtonProps> = ({ title, smallIcon = false, login = false }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(login ? "/auth/login" : "/emp/lp");
  };

  return (
    <button
      onClick={handleClick}
      className="btn_glass_hover flex justify-center items-center gap-4 relative bg-[#0481EF66] pl-5 text-white font-medium leading-[42px] rounded-[50px] overflow-hidden"
    >
      <span className="text-nowrap">{title ?? (login ? "Get Started" : "Explore Jobs")}</span>
      <div className="flex justify-center items-center p-5 ">
        <img
          src={upArrow}
          alt="arrow icon"
          className={smallIcon ? "w-[16px] h-[16px]" : "w-[24px] h-[24px]"}
        />
      </div>
    </button>
  );
};

export default CommonButton;
