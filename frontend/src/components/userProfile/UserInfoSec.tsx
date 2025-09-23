/* eslint-disable @typescript-eslint/ban-ts-comment */

import { UserProfile } from './UserProfile';
import { animate, motion, useMotionValue, useTransform, useScroll } from "framer-motion";
import ScrollVelocity from '../common/ScrollVelocity';
import CRYSTAL from '@/assets/Login/Vector.svg';

import SHADOWLEFT from '@/assets/Login/ShadowLeft.svg';
import SHADOWRIGHT from '@/assets/Login/ShadowRight.svg';
import { BackGroundGrid } from '@/constants/svgs';
import { useRef, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { FloatingDock } from '../common/Floating-dock';

import { ContentSection } from './sections/ContentSection';
import WorkExperienceSection from './sections/WorkExperienceSection';
import CertificationSection from './sections/CertificationSection';
import EducationSection from './sections/EducationSection';
import SelectedProjectsSection from './sections/SelectedProjectsSection';
import VideoIntroductionSection from './sections/VideoIntroductionSection';
import SvgDockUser from '@/assets/svgs/docks/SvgDockUser';
import SvgDockProjects from '@/assets/svgs/docks/SvgDockProjects';
import SvgDockVideo from '@/assets/svgs/docks/SvgDockVideo';
import SvgDockExperiences from '@/assets/svgs/docks/SvgDockExperiences';
import SvgDockEducation from '@/assets/svgs/docks/SvgDockEducation';
import { JobSeekerSkillSection } from './sections/JobSeekerSkillSection';
import { SvgDockCertification } from '@/assets/svgs/docks/SvgDockCertification';
import { useGetJobSeekerResumeQuery } from '@/services/slices/jobSeekerSlice';

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            when: "beforeChildren"
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

const links = [
    {
        title: "User",
        icon: (
            <SvgDockUser />
        ),
        href: "#user-section",
    },

    {
        title: "Selected Projects",
        icon: (
            <SvgDockProjects />
        ),
        href: "#projects-section",
    },
    {
        title: "Video Introduction",
        icon: (
            <SvgDockVideo />
        ),
        href: "#videos-section",
    },
    {
        title: "Work Experience",
        icon: (
            <SvgDockExperiences />
        ),
        href: "#work-experience-section",
    },
    {
        title: "Education",
        icon: (
            <SvgDockEducation />
        ),
        href: "#education-section",
    },
    {
        title: "Certificate",
        icon: (
            <SvgDockCertification />
        ),
        href: "#certification-section",
    },
];


export const UserInfoSec = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const { scrollY } = useScroll();
    const [showDock, setShowDock] = useState(false);
    const [isWorkExperienceEdit, setIsWorkExperienceEdit] = useState(false);
    const [isEducationEdit, setIsEducationEdit] = useState(false);
    const [isCertificationEdit, setIsCertificationEdit] = useState(false);
    const [isSelectedProjectsEdit, setIsSelectedProjectsEdit] = useState(false);
    const [isVideoIntroductionEdit, setIsVideoIntroductionEdit] = useState(false);
    const { data, isLoading } = useGetJobSeekerResumeQuery();


    const resume_url = data?.data?.resume_url || "";
    const fileName = resume_url ? resume_url.split("/").pop() || "resume.pdf" : "resume.pdf";


    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        if (!resume_url) return;
        setIsDownloading(true);
        try {
            await toast.promise(
                (async () => {
                    const res = await fetch(resume_url);
                    if (!res.ok) throw new Error("Failed to fetch resume");

                    const blob = await res.blob();
                    const objectUrl = URL.createObjectURL(blob);

                    const a = document.createElement("a");
                    a.href = objectUrl;
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();

                    setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
                })(),
                { loading: 'Downloading resume…', success: 'Download started', error: 'Failed to download resume' }
            );
        } catch (err) {
            console.error("Download failed:", err);
            window.open(resume_url, "_blank", "noopener,noreferrer");
        } finally {
            setIsDownloading(false);
        }
    };



    // Track scroll position and update dock visibility
    useEffect(() => {
        const unsubscribe = scrollY.onChange((latest) => {
            setShowDock(latest > 50);
        });

        return () => unsubscribe();
    }, [scrollY]);

    const leftShadowX = useTransform(x, (val) => val / 15 - 3); // slightly to the left
    const rightShadowX = useTransform(x, (val) => val / 15 + 3); // slightly to the right

    const handleMouseMove = (e: React.MouseEvent) => {
        const bounds = containerRef.current?.getBoundingClientRect();
        if (!bounds) return;

        const relativeX = e.clientX - bounds.left - bounds.width / 2;
        const relativeY = e.clientY - bounds.top - bounds.height / 2;

        // 💨 More responsive
        animate(x, relativeX, { type: "spring", stiffness: 300, damping: 20 });
        animate(y, relativeY, { type: "spring", stiffness: 300, damping: 20 });
    };


    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div id="user-section">
                <UserProfile />
            </div>
            <motion.div
                className='max-w-[1104px] mx-auto'
                variants={containerVariants}
            >

                {/* <FocusCards cards={cards} /> */}
                <JobSeekerSkillSection />

                <div id="projects-section">
                    <SelectedProjectsSection
                        isSelectedProjectsEdit={isSelectedProjectsEdit}
                        containerVariants={containerVariants}
                        //@ts-ignore
                        itemVariants={itemVariants}
                        setIsSelectedProjectsEdit={setIsSelectedProjectsEdit}
                    />
                </div>

                {/* Rest of the content with similar motion wrappers */}

                <div id="videos-section">
                    <VideoIntroductionSection
                        isVideoIntroductionEdit={isVideoIntroductionEdit}
                        setIsVideoIntroductionEdit={setIsVideoIntroductionEdit}
                    />
                </div>/

                {/* Continue with the same pattern for other sections */}
                {/* Work Experience */}

                <div id="work-experience-section">
                    <WorkExperienceSection
                        isWorkExperienceEdit={isWorkExperienceEdit}
                        setIsWorkExperienceEdit={setIsWorkExperienceEdit}
                        containerVariants={containerVariants}
                        //@ts-ignore
                        itemVariants={itemVariants} />
                </div>

                {/* Education */}

                <div id="education-section">
                    <EducationSection
                        isEducationEdit={isEducationEdit}
                        setIsEducationEdit={setIsEducationEdit}
                        containerVariants={containerVariants}
                        //@ts-ignore
                        itemVariants={itemVariants} />
                </div>




                {/* Certifications */}
                <div id="certification-section">
                    <CertificationSection isCertificationEdit={isCertificationEdit} setIsCertificationEdit={setIsCertificationEdit} />
                </div>

                <ContentSection
                    handleMouseMove={handleMouseMove}
                    containerRef={containerRef}
                    x={x}
                    y={y}
                    leftShadowX={leftShadowX}
                    rightShadowX={rightShadowX}
                    CRYSTAL={CRYSTAL}
                    SHADOWLEFT={SHADOWLEFT}
                    SHADOWRIGHT={SHADOWRIGHT}
                    BackGroundGrid={BackGroundGrid}
                    ScrollVelocity={ScrollVelocity}
                />


            </motion.div>
            <motion.div
                className="flex items-center justify-center gap-4 z-50 w-full fixed bottom-[20px]"
                initial={{ opacity: 0, y: 100 }}
                animate={{
                    opacity: showDock ? 1 : 0,
                    y: showDock ? 0 : 100
                }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                }}
            >
                <div className="flex items-center gap-4 bg-[#525252]/10 backdrop-blur-md rounded-full px-4 py-2 border border-[#525252]/20">
                    <FloatingDock items={links} />

                    {resume_url && (
                        <button
                            onClick={handleDownload}
                            disabled={isLoading || isDownloading}
                            className="h-12 px-6 rounded-full bg-blue-500 backdrop-blur-md border border-[#525252]/50 shadow-lg shadow-[#525252]/30 text-white font-medium hover:bg-blue-600 transition-colors"
                        >
                            {(isLoading || isDownloading) ? "Downloading..." : "Download Resume"}
                        </button>
                    )}
                </div>

            </motion.div>
        </motion.div>
        //dock
    )
}