
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

import { useParams } from "react-router-dom";
import { useGetJobSeekersOverViewQuery } from "@/services/slices/adminSlice";
import { skipToken } from "@reduxjs/toolkit/query";
import DownloadInfoItem from "@/components/common/ApplyJob/DownloadInfoItem";




const CandidateProfileUserInfo = () => {

    const { id } = useParams<{ id: string }>();


    const { data } = useGetJobSeekersOverViewQuery(
        id ? { id } : skipToken
    );

    const ProfileData = data?.data;


        // Transform null values to undefined for social_links
        const socialLinks = ProfileData?.social_links
        ? {
              facebook_url: ProfileData.social_links.facebook_url ?? undefined,
              linkedin_url: ProfileData.social_links.linkedin_url ?? undefined,
              behance_url: ProfileData.social_links.behance_url ?? undefined,
              portfolio_url: ProfileData.social_links.portfolio_url ?? undefined,
              github_url: ProfileData.social_links.github_url ?? undefined,
          }
        : undefined;


    return (
        <>
            <div className="mt-[61px]  flex justify-between">
                <div className="w-[60%]">
                    <div className="flex gap-[21px]">
                        <AvatarProfile src={ProfileData?.profile_image_url || ''} size="w-[120px] h-[120px]" />
                        <div className=" flex gap-2 flex-col justify-between">
                            <h3 className=" text-[32px]  font-semibold">{ProfileData?.name || ''}</h3>
                            <h3 className="text-[#6B6B6B] text-[20px]">{ProfileData?.occupation?.role_name || '-'}</h3>
                            <CandidateProfileAvaliable status={ProfileData?.is_open_to_work || false} />
                        </div>
                    </div>

                    <CandidateDescription description={ProfileData?.bio || ''} />


                    <CandidateSkills skillArray={ProfileData?.occupation?.skills || []} />


                </div>
                <div className="w-[300px]  flex flex-col  ">
                    <h3 className="text-[20px] font-semibold">Contact Information</h3>

                    <div className="mt-[33px] space-y-[24px]">
                        <InfoItem icon={MAIL} text={ProfileData?.email || ''} alt="Phone" />
                        <InfoItem icon={LOCATION} text={ProfileData?.address || ''} alt="Location" />
                        <InfoItem icon={CONTACT} text={ProfileData?.phone_number || ''} alt="Phone" />
                        <DownloadInfoItem link={ProfileData?.resume_url || ''} icon={FILE} color text={'Download CV'} alt="Phone" />
                        <DownloadInfoItem link={ProfileData?.cover_letter_url || ''} icon={FILE} color text={'Download Cover Letter'} alt="Phone" />
                    </div>
                    <h3 className="text-[20px] mt-[36px] font-semibold">External Links</h3>
                   
                    <CandidateSocialLinks links={socialLinks} />
                </div>

            </div>
            <CandidateTabs />
        </>
    )
}

export default CandidateProfileUserInfo;