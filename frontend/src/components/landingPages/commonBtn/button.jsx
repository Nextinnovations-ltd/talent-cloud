import React from 'react'
import upArrow from '@/assets/JobPortal/arrow-up-left.svg'
import { Link } from 'react-router-dom'
const CommonButton = ({title,url,smallIcon}) => {
  return (
    <Link to={url} target='_blank'>
    <button  className="btn_glass_hover flex justify-center items-center gap-4 relative bg-[#0481EF66] pl-5  text-white font-[500] leading-[42px] rounded-[50px] overflow-hidden">
    <span>{title} </span>   
      <div className="flex justify-center items-center p-4 ">
      <img
          src={upArrow}
          alt=""
          className={smallIcon ? "w-[16px] h-[16px]" : "w-[33px] h-[33px]"}
        />
      
    
      </div>
      </button>
      </Link>
  )
}

export default CommonButton