import { useGetJobSeekerDetailVideoQuery } from "@/services/slices/adminSlice";
import { skipToken } from "@reduxjs/toolkit/query";
import { useState } from "react";
import { useParams } from "react-router-dom";

const Video = () => {
  const {id } = useParams<{id:string}>();
  const [isLoaded, setIsLoaded] = useState(false);
  const {data} = useGetJobSeekerDetailVideoQuery(id ? {id} : skipToken);


  console.log(data);
  // if(!data?.data){
  //   return <div> <p>No video data!</p></div>
  // }

  return (
    <div className="mt-[71px]">
      <h3 className="text-[32px] text-[#575757]">Video Introduction</h3>

      <div className="mt-[30px] relative">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-2xl animate-pulse">
            <span className="text-gray-500">Loading video...</span>
          </div>
        )}

        <iframe
          width="100%"
          height="500"
          className={`rounded-2xl transition-opacity duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          src={data?.data}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          onLoad={() => setIsLoaded(true)}
        ></iframe>
      </div>
    </div>
  );
};

export default Video;
