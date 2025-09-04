import SvgBehance from "@/assets/svgs/SvgBehance"
import SvgFacebook from "@/assets/svgs/SvgFacebook"
import SvgGitHub from "@/assets/svgs/SvgGitHub"
import SvgLinkedIn from "@/assets/svgs/SvgLinkedIn"
import SvgWorld from "@/assets/svgs/SvgWorld"

export const CandidateSocialLinks = () => {
  return (
    <div className="flex gap-6 items-center mt-[32px]">
        <SvgFacebook/>
        <SvgLinkedIn/>
        <SvgGitHub/>
        <SvgBehance/>
        <SvgWorld/>
    </div>
  )
}
