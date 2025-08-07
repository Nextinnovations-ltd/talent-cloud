import DescriptionsContent from "@/pages/admin/CreateNewJob/StepsForms/Components/DescriptionsContent"

type AboutJobProps = {
     jobTitle: string,
     responsibilities: string,
     requirements: string,
     offer: string

}


const AboutJob: React.FC<AboutJobProps> = ({
     jobTitle, requirements, responsibilities, offer
}) => {
     return (
          <div className="mt-[60px]">

               <h3 className="mt-[23px] mb-[14px] font-semibold text-[18px] line-clamp-2">Our client is seeking a {jobTitle || ''} to join their team!</h3>
               <DescriptionsContent
                    title="Responsibilities : "
                    content={responsibilities}
               />
               <DescriptionsContent
                    title="Requirements : "
                    content={requirements}
               />
               <DescriptionsContent
                    title="What we offer?"
                    content={offer}
               />
          </div>
     )
}

export default AboutJob