import {
  GoogleIcon,
  LinkedinIcon,
} from "@/assets/svgs/svgs";
import TalentCloudLogo from "@/assets/Employee/Vector (3).svg";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { SocialButton } from "../SocialButton";
import { NavLink } from "../NavLink";
import routesMap from "@/constants/routesMap";
import { useState } from "react";
import GITHUB from '@/assets/images/github.png';

const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=394068996425-9uu48cj29id232k3di793gvdbb4a50fa.apps.googleusercontent.com&redirect_uri=http://staging.talent-cloud.asia/api/v1/auth/accounts/google&response_type=code&scope=email profile';
const linkedinAuthUrl = 'https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=866khyw28sevz8&redirect_uri=http://staging.talent-cloud.asia/api/v1/auth/accounts/linkedin&state=foobar&scope=openid email profile';
const githubAuthUrl = "https://github.com/login/oauth/authorize?client_id=Ov23li8OorJeQrCKjngl&redirect_uri=http://staging.talent-cloud.asia/api/v1/auth/accounts/github&scope=user:email";

type AuthFormFrameType = {
  form: React.ReactNode;
  type: "login" | "signup";
};



export const AuthFormFrame: React.FC<AuthFormFrameType> = ({ form, type }) => {
  const { t } = useTranslation("auth");
  const [loading,setLoading] = useState(false);

  const handleSocialOAuthCallback = (
    type: "google" | "linkedIn" | "github"
  ) => {
    let oauthUrl = "";
    setLoading(true);

    switch (type) {
      case "google":
        oauthUrl = googleAuthUrl;
        break;

      case "linkedIn":
        oauthUrl = linkedinAuthUrl;
        break;

      case "github":
        oauthUrl = githubAuthUrl;
        break;

      default:
        console.error("Unsupported OAuth provider:", type);
        return;
    }

    window.location.href = oauthUrl;
    setLoading(false);

  };

  return (
    <div className=" px-[10px] md:mx-0 min-h-[100svh] flex items-center justify-center bg-slate-100 ">
      <Card className="text-text-primary mt-10 mb-5 mx-auto px-5 pb-4 border border-bg-border rounded-[15px] sm:w-[500px] sm:px-10 bg-white drop-shadow-sm">
        <div className="mt-10 flex flex-col items-center justify-center  ">
        <img src={TalentCloudLogo} width={220} height={60}/>
          <div className="mt-4 text-center font-[500] text-[18px] text-[#686C73]">
            {t("talentDes")}
          </div>
        </div>

        <div className="my-6">
          {form}
          <div className="flex items-center mt-2 mb-1">
            <div className="flex-1 border-t border-bg-hr"></div>
            <span className="mx-4 text-bg-hrsecondary">(OR)</span>
            <div className="flex-1 border-t border-bg-hr"></div>
          </div>

          <SocialButton
            handleClick={() => handleSocialOAuthCallback("google")}
            title={t("socialMedia.google")}
            loading={loading}
            icon={<GoogleIcon />}
          />

          <SocialButton
            handleClick={() => handleSocialOAuthCallback("linkedIn")}
            title={t("socialMedia.linkedIn")}
            loading={loading}
            icon={<LinkedinIcon />}
          />
          <SocialButton
            handleClick={() => handleSocialOAuthCallback("github")}
            title={t("socialMedia.github")}
            loading={loading}
            icon={<img className="w-[26px]" src={GITHUB}/>}
          />
          {type === "login" ? (
            <div className="mt-4 text-center text-sm  gap-3 flex items-center justify-center text-text-semilight font-normal">
              {t("alreadyAcc")}
              <NavLink
                to={`/auth/${routesMap.login.path}`}
                title={t("title")}
              />
            </div>
          ) : (
            <div className="mt-4 text-center text-sm  gap-3 flex items-center justify-center text-text-semilight font-normal">
              {t("noacc")}
              <NavLink
                to={`/auth/${routesMap.signup.path}`}
                title={t("createacc")}
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
