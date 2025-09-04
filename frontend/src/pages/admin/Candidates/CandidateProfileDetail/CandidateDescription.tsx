import clsx from "clsx";
import { useState } from "react";

 const CandidateDescription = () => {
    const [full,setFull] = useState(false);
  return (
    <>
    <p className={clsx('mt-[45px] text-[#3F3D51] leading-[28px] font-[16px]',full ? ' line-clamp-4 ' : ' line-clamp-0 ')}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. </p><span  onClick={()=>setFull((prev)=>!prev)} className="underline cursor-pointer text-[#3F3D51] ">
        {
            full ? 'Read more' : 'Read less'
        }
    </span>
    </>
  )
}

export default CandidateDescription;