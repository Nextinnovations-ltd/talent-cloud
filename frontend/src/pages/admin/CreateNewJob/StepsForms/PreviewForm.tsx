import { useJobFormStore } from "@/state/zustand/create-job-store";
import DescriptionsContent from "./Components/DescriptionsContent";
import InfoGrid from "./Components/InfoGrid";
import { useGetOrganizationDetailByAdminQuery } from "@/services/slices/adminSlice";





const PreviewForm = () => {
    const {data} = useGetOrganizationDetailByAdminQuery();
    const { formData } = useJobFormStore();



    return (
        <div className="mt-[76px] px-[20px]">
            <h3 className="text-[32px] mb-[20px] font-semibold">{formData?.stepOne?.title || ""}</h3>
            <div className="flex items-center text-[24px] gap-[16px] text-[#575757]">
                <img width={67} height={67} className="rounded-full" src={data?.data?.image_url}/>
                <h3>{data?.data?.name}</h3>

            </div>

            <InfoGrid/>
            {
                formData?.stepOne?.title && <h3 className="text-[20px] font-semibold">Our client is seeking a {formData?.stepOne?.title || ""} to join their team!</h3>
            }
           
            <DescriptionsContent
                title="Job Description : "
                content={formData?.stepOne.description}
            />

            <DescriptionsContent
                title="Responsibilities : "
                content={formData?.stepTwo?.responsibilities}
            />
            <DescriptionsContent
                title="Requirements : "
                content={formData?.stepTwo?.requirements}
            />
            <DescriptionsContent
                title="What we offer?"
                content={formData?.stepTwo?.offered_benefits}
            />

        </div>
    )
}

export default PreviewForm;
