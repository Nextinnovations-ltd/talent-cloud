import SvgBehance from "@/assets/svgs/SvgBehance"
import SvgFacebook from "@/assets/svgs/SvgFacebook"
import SvgGitHub from "@/assets/svgs/SvgGitHub"
import SvgLinkedIn from "@/assets/svgs/SvgLinkedIn"
import SvgWorld from "@/assets/svgs/SvgWorld"


type SocialLinks = {
  facebook_url?: string
  linkedin_url?: string
  github_url?: string
  behance_url?: string
  portfolio_url?: string
}

export const CandidateSocialLinks = ({ links }: { links?: SocialLinks }) => {
  const socialLinks = [
    { icon: <SvgFacebook />, url: links?.facebook_url },
    { icon: <SvgLinkedIn />, url: links?.linkedin_url },
    { icon: <SvgGitHub />, url: links?.github_url },
    { icon: <SvgBehance />, url: links?.behance_url },
    { icon: <SvgWorld />, url: links?.portfolio_url },
  ]

  return (
    <div className="flex gap-6 items-center mt-[32px]">
      {socialLinks.map((item, idx) =>
        item.url ? (
          <a
            key={idx}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity"
          >
            {item.icon}
          </a>
        ) : (
          <div
            key={idx}
            className="opacity-20 cursor-not-allowed transition-opacity"
          >
            {item.icon}
          </div>
        )
      )}
    </div>
  )
}
