import clsx from 'clsx';
import React from 'react';

interface InfoItemProps {
  icon: string;
  text: string;
  alt: string;
  color?:boolean
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, text, alt,color }) => (
  <div className="flex items-center gap-2">
    <img width={24} height={24} src={icon} alt={alt}/>
    <h3 className={clsx('text-[14px]',color ?  "text-[#0389FF]" : "text-[#575757]"   )}>{text}</h3>
  </div>
);

export default InfoItem; 