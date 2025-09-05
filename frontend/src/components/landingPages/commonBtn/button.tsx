/* eslint-disable @typescript-eslint/no-unused-expressions */
import { FC } from "react";
import upArrow from "@/assets/JobPortal/arrow-up-left.svg";

interface CommonButtonProps {
  title?: string;         // Text to display (optional — defaults applied below)   
  url?: string;  // Whether button navigates to login
  path?:string   
}

const CommonButton: FC<CommonButtonProps> = ({ title, url ,path}) => {



  const handleClick = (url?: string, path?: string) => {
    if (!url) return;

    const fullUrl = path ? `${url}?path=${encodeURIComponent(path)}` : url;
    window.open(fullUrl, "_blank"); // opens in new tab
  };

  return (
    <button
      onClick={()=>handleClick(url,path)}
      className="btn_glass_hover flex justify-center items-center gap-4 relative bg-[#0481EF66] pl-5 text-white font-medium leading-[42px] rounded-[50px] overflow-hidden"
    >
      <span className="text-nowrap">{title}</span>
      <div className="flex justify-center items-center p-5 ">
        <img
          src={upArrow}
          alt="arrow icon"
          className={ "w-[24px] h-[24px]"}
        />
      </div>
    </button>
  );
};

export default CommonButton;
