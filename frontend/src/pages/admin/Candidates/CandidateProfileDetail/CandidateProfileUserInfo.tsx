
import { AvatarProfile } from "@/components/common/Avatar";
import CandidateProfileAvaliable from "./CandidateProfileAvaliable";
import InfoItem from "@/components/common/ApplyJob/InfoItem";
import CONTACT from '@/assets/svgs/phone.svg';
import MAIL from '@/assets/svgs/mail.svg';

import LOCATION from '@/assets/location.svg';
import FILE from '@/assets/svgs/file.svg';
import { CandidateSocialLinks } from "./CandidateSocialLinks";
import { CandidateSkills } from "./CandidateSkills";
import CandidateDescription from "./CandidateDescription";
import CandidateTabs from "./CandidateTabs";





const CandidateProfileUserInfo = () => {
    return (
     <>
        <div className="mt-[61px]  flex justify-between">
            <div className="w-[60%]">
                <div className="flex gap-[21px]">
                    <AvatarProfile size="w-[120px] h-[120px]" />
                    <div className=" flex gap-2 flex-col justify-between">
                        <h3 className=" text-[32px]  font-semibold"> Than Naung</h3>
                        <h3 className="text-[#6B6B6B] text-[20px]"> UI UX Designer</h3>
                        <CandidateProfileAvaliable />
                    </div>
                </div>
                
                <CandidateDescription/>


                <CandidateSkills skillArray={['Figma', 'Adobe XD', 'Adobe Photoshop', 'Adobe Illustrator', 'Graphic Design ', 'User Interface Design', 'User Experience Design', 'Brand Identity', 'Canva', 'React', 'Python','Figma', 'Adobe XD', 'Adobe Photoshop', 'Adobe Illustrator', 'Graphic Design ', 'User Interface Design', 'User Experience Design', 'Brand Identity', 'Canva', 'React', 'Python']} />


            </div>
            <div className="w-[300px]  flex flex-col  ">
                <h3 className="text-[20px] font-semibold">Contact Information</h3>

                <div className="mt-[33px] space-y-[24px]">
                    <InfoItem icon={MAIL} text={'example@gmail.com'} alt="Phone" />
                    <InfoItem icon={LOCATION} text={'Yangon , Myanmar'} alt="Location" />
                    <InfoItem icon={CONTACT} text={'+95 9123456789'} alt="Phone" />
                    <InfoItem icon={FILE} color text={'Download CV'} alt="Phone" />
                    <InfoItem icon={FILE} color text={'Download Cover Letter'} alt="Phone" />
                </div>
                <h3 className="text-[20px] mt-[36px] font-semibold">External Links</h3>
                <CandidateSocialLinks />
            </div>

        </div>
        <CandidateTabs/>
     </>
    )
}

export default CandidateProfileUserInfo;