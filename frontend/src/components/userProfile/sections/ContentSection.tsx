import { motion, animate, MotionValue } from 'framer-motion';
import React, { RefObject } from 'react';
import { useGetJobSeekerProfileQuery } from '@/services/slices/jobSeekerSlice';
import type { UseJobSeekerProfileResponse } from '@/services/slices/jobSeekerSlice';
// Removed unused Link import


type ContentSectionProps = {
  handleMouseMove: (e: React.MouseEvent) => void;
  containerRef: RefObject<HTMLDivElement>;
  x: MotionValue<number>;
  y: MotionValue<number>;
  leftShadowX: MotionValue<number>;
  rightShadowX: MotionValue<number>;
  CRYSTAL: string;
  SHADOWLEFT: string;
  SHADOWRIGHT: string;
  BackGroundGrid: React.ComponentType;
  ScrollVelocity: React.ComponentType<{ texts: string[]; className?: string }>;
};

export const ContentSection: React.FC<ContentSectionProps> = ({
  handleMouseMove,
  containerRef,
  x,
  y,
  leftShadowX,
  rightShadowX,
  CRYSTAL,
  SHADOWLEFT,
  SHADOWRIGHT,
  BackGroundGrid,
  ScrollVelocity,
}) => {


    const {
        data: profileData,
      } = useGetJobSeekerProfileQuery();
    
      const userData: UseJobSeekerProfileResponse['data'] | undefined = profileData?.data;

  // Social links mapping
  const socialLinks = [
    { name: "Facebook", key: "facebook_url" },
    { name: "Linkedin", key: "linkedin_url" },
    { name: "Behance", key: "behance_url" },
    { name: "Portfolio", key: "portfolio_url" },
  ];

  return (
    <>
      <motion.div
        ref={containerRef}
        className="w-full border-2 relative rounded-[30px] h-[459px] flex flex-col justify-center overflow-hidden items-center gap-[30px] mb-[100px]"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          animate(x, 0);
          animate(y, 0);
        }}
      >
        {/* Shadow Images Following Cursor */}
        <motion.img
          src={SHADOWLEFT}
          className="absolute z-50 top-[-170px] left-[-70px] pointer-events-none"
          style={{ x: leftShadowX }}
        />
        <motion.img
          src={SHADOWRIGHT}
          className="absolute z-50 top-[-170px] right-[-70px] pointer-events-none"
          style={{ x: rightShadowX }}
        />

        <motion.div className="absolute bottom-0 right-0 left-0 z-20">
          <BackGroundGrid />
        </motion.div>

        <h3 className="text-[26px] z-50">Looking for a new talent?</h3>
        <h3 className="text-[46px] z-50">{userData?.email}</h3>

        <motion.button
          className="w-[185px] z-50 h-[64px] bg-[#0389FF] flex items-center justify-center gap-[5px] rounded-[8px] text-[16px] font-[600] text-white"
          whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(3, 137, 255, 0.3)" }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          Download CV
        </motion.button>

        <ul className="flex gap-[34px] z-50">
          {socialLinks.map(({ name, key }) => {
            let url: string | undefined;
            if (userData) {
              if (key === 'facebook_url') url = userData.facebook_url;
              else if (key === 'linkedin_url') url = userData.linkedin_url;
              else if (key === 'behance_url') url = userData.behance_url;
              else if (key === 'portfolio_url') url = userData.portfolio_url;
            }
            if (!url) return null;
            return (
              <a
                href={url}
                key={name}
                className="text-[18px] flex gap-[10px]"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={CRYSTAL} alt="Crystal" className="w-[22px] h-[22px]" />
                {name}
              </a>
            );
          })}
        </ul>
      </motion.div>

      <ScrollVelocity
        texts={[userData?.name || '']}
        className="custom-scroll-text text-[#0389FF] h-[110px] mt-[80px]  text-[190px]"
      />
    </>
  );
};
