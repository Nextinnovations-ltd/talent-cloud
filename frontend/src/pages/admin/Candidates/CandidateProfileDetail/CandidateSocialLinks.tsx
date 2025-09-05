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

  const isValidUrl = (url: string | undefined): boolean => {
    if (!url) return false;
    

    return url.includes('.') || url.startsWith('http') || url.startsWith('//');
  }

  const normalizeUrl = (url: string): string => {

    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
      return url;
    }
    
    if (url.includes('.')) {
      return `https://${url}`;
    }
    
    return url;
  }

  return (
    <div className="flex gap-6 items-center mt-[32px]">
      {socialLinks.map((item, idx) => {
        if (!item.url || !isValidUrl(item.url)) {
          return (
            <div
              key={idx}
              className="opacity-20 cursor-not-allowed transition-opacity"
            >
              {item.icon}
            </div>
          );
        }

        const normalizedUrl = normalizeUrl(item.url);
        
        return (
          <a
            key={idx}
            href={normalizedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-80"
            onClick={(e) => {
              // Extra safety - if the URL still looks problematic, prevent default
              if (!normalizedUrl.includes('.') && !normalizedUrl.startsWith('http')) {
                e.preventDefault();
              }
            }}
          >
            {item.icon}
          </a>
        );
      })}
    </div>
  )
}