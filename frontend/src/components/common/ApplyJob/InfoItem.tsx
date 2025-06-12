import React from 'react';

interface InfoItemProps {
  icon: string;
  text: string;
  alt: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, text, alt }) => (
  <div className="flex items-center gap-2">
    <img width={24} height={24} src={icon} alt={alt}/>
    <h3 className="text-[#6B6B6B] text-[14px]">{text}</h3>
  </div>
);

export default InfoItem; 