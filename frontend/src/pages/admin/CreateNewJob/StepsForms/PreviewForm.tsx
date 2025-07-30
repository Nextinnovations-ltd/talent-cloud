import { useJobFormStore } from "@/state/zustand/create-job-store";
import DescriptionsContent from "./Components/DescriptionsContent";
import InfoGrid from "./Components/InfoGrid";


const PreviewForm = () => {

    const { formData } = useJobFormStore();

    console.log("------")
    console.log(formData)
    console.log("------")



    return (
        <div className="mt-[76px] px-[20px]">
            <h3 className="text-[32px] mb-[8px] font-semibold">{formData?.stepOne?.title || ""}</h3>
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
