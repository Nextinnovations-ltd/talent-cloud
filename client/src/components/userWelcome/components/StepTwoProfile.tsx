import { ImageUploader } from "@/components/common/FileUpload"



export const StepTwoProfile = () => {
  return (
  <div className="w-full flex  text-center items-center flex-col justify-center">
    <ImageUploader/>
     {/* <AvatarProfile status={false} size="w-[187px] h-[187px]"/> */}
     <p className="text-[#686C73] mt-[25px]">Upload your profile picture to stand out.</p>
  </div>
  )
}
