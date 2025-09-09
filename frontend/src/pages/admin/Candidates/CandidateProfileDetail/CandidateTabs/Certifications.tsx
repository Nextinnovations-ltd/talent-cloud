import { useGetJobSeekerDetailCertificationQuery } from "@/services/slices/adminSlice"
import { skipToken } from "@reduxjs/toolkit/query";
import { useParams } from "react-router-dom";
import CommonError from "@/components/CommonError/CommonError";
import EMPTYTABS from '@/assets/SuperAdmin/EmptyTabs.png';
import DefaultCertifi from '@/assets/Login/Login/Certificate Photo.png';


const Certifications = () => {

  const {id} = useParams<{id:string}>()

  const {data,isLoading} = useGetJobSeekerDetailCertificationQuery(id?{id}: skipToken);



  if(isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
       Loading ...
      </div>
    )
  } 

  if (!data?.data || data.data.length === 0 ) {
    return (
      <div className="text-center  text-gray-500 mt-20 text-lg">
      <CommonError 
        image={EMPTYTABS} 
        width={117} 
        title="No certificate found" 
        description="This candidate hasn’t added any certificate."/>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-[35px] mt-[72px]">
    {
      data?.data?.map((e)=> <CertificateCard credential_id={e.credential_id} duration={e.duration} organization={e.organization} title={e.title} url={e.url}/>)
    }

</div>
  )
}

type CertificateProps = {
  duration:string;
  organization:string;
  title:string;
  url:string;
  credential_id:number
}

const CertificateCard: React.FC<CertificateProps> = ({ duration, organization, title, url, credential_id }) => {
  return (
    <div className="w-[490px]">
      {/* PDF Preview */}
      <img src={DefaultCertifi} alt="Certification" />

      <div>
        <h3 className="text-[23px] font-semibold mt-[26px] mb-[17px]">
          {title}
        </h3>
        <p className="text-[15px] mb-[12px]">{organization}</p>
        <p className="mb-[12px] text-[14px] text-[#6B6B6B]">
          Credential ID: {credential_id || 0}
        </p>
        <p className="text-[#6B6B6B] text-[14px]">{duration}</p>

        {/* Conditionally render the button */}
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-blue-600 underline"
          >
            View Certificate
          </a>
        ) : (
          <p className="mt-3 text-red-500 text-sm italic">No certificate link provided</p>
        )}
      </div>
    </div>
  );
};



export default Certifications;