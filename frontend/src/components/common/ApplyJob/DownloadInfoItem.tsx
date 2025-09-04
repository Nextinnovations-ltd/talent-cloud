import clsx from 'clsx';
import React, { useState } from 'react';
import useToast from '@/hooks/use-toast';



interface InfoItemProps {
  icon: string;
  text: string;
  alt: string;
  color?:boolean;
  link:string
}

const DownloadInfoItem: React.FC<InfoItemProps> = ({ icon, text, alt,color,link }) => {

    const [isDownloading, setIsDownloading] = useState(false);

    const { showNotification } = useToast();

    const handleDownLoad = async ()=> {

        if (!link) {
            showNotification({
              message: "No resume available for this applicant",
              type: "danger",
            });
            return;
          }

          try {
            setIsDownloading(true);
            const response = await fetch(link);
            const blob = await response.blob();
        
            const url = window.URL.createObjectURL(blob);
            const linkD= document.createElement("a");
            linkD.href = url;
            linkD.setAttribute("download", ` resume.pdf`);
            document.body.appendChild(linkD);
            linkD.click();
        
            // Cleanup
            document.body.removeChild(linkD);
            window.URL.revokeObjectURL(url);
      
            showNotification({
              message: "Download Success",
              type: "success",
            });
          } catch  {
            showNotification({
              message: "Failed to download CV",
              type: "danger",
            });
          } finally {
            setIsDownloading(false);
          }
     
    }



    return (
        <button disabled={!link} onClick={handleDownLoad} className={clsx('flex  items-center  gap-2',!link && 'opacity-[0.4] cursor-not-allowed', link && 'cursor-pointer')}>
          <img width={24} height={24} src={icon} alt={alt}/>
          {
            isDownloading ? <h3 className={clsx('text-[14px]',color ?  "text-[#0389FF]" : "text-[#575757]"   )}>Loading...</h3>: <h3 className={clsx('text-[14px]',color ?  "text-[#0389FF]" : "text-[#575757]"   )}>{text}</h3>
          }
        </button>
      )
};

export default DownloadInfoItem; 