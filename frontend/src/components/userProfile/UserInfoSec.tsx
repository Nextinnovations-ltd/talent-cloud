import SampleImage from '../../assets/Login/Frame 35677.png';
import SampleImage2 from '../../assets/Login/Frame 35681.png';
import SampleImage3 from '../../assets/Login/Bluelife 1.png';
import SampleImage4 from '../../assets/Login/IIDA.png';
import { UserProfile } from './UserProfile';
import StarBorder from '../common/StarBorder';
import THUMBNAIL from '@/assets/Login/Thumbnail.png';
import GOOGLECER from '@/assets/Login/Certificate Photo.png';
import { animate, motion, useMotionValue, useTransform, useScroll } from "framer-motion";
import { PinContainer } from '../common/3d-pin';
import ScrollVelocity from '../common/ScrollVelocity';
import CRYSTAL from '@/assets/Login/Vector.svg';
import { Title } from './Title';
import SHADOWLEFT from '@/assets/Login/ShadowLeft.svg';
import SHADOWRIGHT from '@/assets/Login/ShadowRight.svg';
import { BackGroundGrid } from '@/constants/svgs';
import { useRef, useEffect, useState } from 'react';
import DefaultCertifi from '@/assets/Login/Login/Certificate Photo.png';
import { FloatingDock } from '../common/Floating-dock';
import {
    IconBrandGithub,
    IconBrandX,
    IconExchange,
    IconHome,
    IconNewSection,
    IconTerminal2,
} from "@tabler/icons-react";

// Import the new components
import { SelectedProjects } from './components/SelectedProjects';
import { EducationCard } from './components/EducationCard';
import { WorkExperienceCard } from './components/WorkExperienceCard';
import { CertificationCard } from './components/CertificationCard';
import { FocusCards } from '../common/Focus-Card';
import { useNavigate } from 'react-router-dom';
import WorkExperienceSection from './sections/WorkExperienceSection';

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
        title: "Home",
        icon: (
            <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
        ),
        href: "#",
    },

    {
        title: "Products",
        icon: (
            <IconTerminal2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />
        ),
        href: "#",
    },
    {
        title: "Components",
        icon: (
            <IconNewSection className="h-full w-full text-neutral-500 dark:text-neutral-300" />
        ),
        href: "#",
    },
    {
        title: "Aceternity UI",
        icon: (
            <IconNewSection className="h-full w-full text-neutral-500 dark:text-neutral-300" />
        ),
        href: "#",
    },
    {
        title: "Changelog",
        icon: (
            <IconExchange className="h-full w-full text-neutral-500 dark:text-neutral-300" />
        ),
        href: "#",
    },

    {
        title: "Twitter",
        icon: (
            <IconBrandX className="h-full w-full text-neutral-500 dark:text-neutral-300" />
        ),
        href: "#",
    },
    {
        title: "GitHub",
        icon: (
            <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
        ),
        href: "#",
    },
];


const cards = [
    { title: "Figma", year: '03', cardColor: '#0389FF', ellipseColor: '#0D84EC' },
    { title: "Photoshop", year: '02', cardColor: '#1DA787', ellipseColor: '#189F7F' },
    { title: "Adobe XD", year: '01', cardColor: '#F59502', ellipseColor: '#EA8E0A' },
    { title: "Protopie", year: '01', cardColor: '#F57E9B', ellipseColor: '#EC7391' },
    { title: "Canva", year: '02', cardColor: '#F87E56', ellipseColor: '#F3754B' },
    { title: "Motiff", year: '01', cardColor: '#C003FF', ellipseColor: '#B611ED' },
]

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

    const navigate = useNavigate();

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
            <UserProfile />
            <motion.div
                className='max-w-[1104px] mx-auto'
                variants={containerVariants}
            >





                <FocusCards cards={cards} />

                <Title
                    title={" Selected Projects"}
                    isEdit={isSelectedProjectsEdit}
                    onEditToggle={() => setIsSelectedProjectsEdit((prev) => !prev)}
                />

                <motion.div
                    className='grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-[72px] mb-20 md:mb-32 lg:mb-[140px]'
                    variants={containerVariants}
                >
                    {[SampleImage, SampleImage2, SampleImage4, SampleImage3].map((img, index) => (
                        <motion.div
                            key={index}
                            className="h-[25rem] w-full flex items-center justify-center"
                            variants={itemVariants}
                            whileHover={{ scale: 1.03 }}
                        >
                            <PinContainer
                                title="/youtube.com"
                                href="https://twitter.com/mannupaaji"
                            >
                                <SelectedProjects img={img} isEdit={isSelectedProjectsEdit} />
                            </PinContainer>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Rest of the content with similar motion wrappers */}

                <Title title={"Video Introduction"} />

                <motion.div
                    className='mb-[70px] px-[100px]'
                    variants={itemVariants}
                >
                    <img src={THUMBNAIL} alt="" />
                </motion.div>

                {/* Continue with the same pattern for other sections */}
                {/* Work Experience */}

                <WorkExperienceSection isWorkExperienceEdit={isWorkExperienceEdit} setIsWorkExperienceEdit={setIsWorkExperienceEdit} containerVariants={containerVariants} itemVariants={itemVariants} />


                {/* Education */}

                <Title
                    title={"Education"}
                    isEdit={isEducationEdit}
                    onEditToggle={() => setIsEducationEdit((prev) => !prev)}
                />

                <motion.div
                    className='grid grid-cols-2 gap-[143px] mb-[143px]'
                    variants={containerVariants}
                >
                    <motion.div variants={itemVariants}>
                        <EducationCard isEdit={isEducationEdit} />
                    </motion.div>
                </motion.div>

                {/* Certifications */}

                <Title
                    title={"Certifications"}
                    isEdit={isCertificationEdit}
                    onEditToggle={() => setIsCertificationEdit((prev) => !prev)}
                />

                <motion.div
                    className='grid grid-cols-2 gap-[74px] mb-[143px]'
                    variants={containerVariants}
                >
                    <motion.div variants={itemVariants}>
                        <CertificationCard
                            img={GOOGLECER}
                            name='Google UX Design Professional'
                            org='Google'
                            id="Credential ID:  GG0123456789"
                            expire='Issued Apr 2023  .  No Expiration Date'
                            isEdit={isCertificationEdit}
                        />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <CertificationCard
                            img={DefaultCertifi}
                            name='Professional Diploma in UX Design'
                            org='UX Design Institue'
                            id="Credential ID:  UXD123456789"
                            expire='Expiration Date:  Dec 2026'
                            isEdit={isCertificationEdit}
                        />
                    </motion.div>
                </motion.div>


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
                    <h3 className="text-[46px] z-50">thannaung998@gmail.com</h3>

                    <motion.button
                        className="w-[185px] z-50 h-[64px] bg-[#0389FF] flex items-center justify-center gap-[5px] rounded-[8px] text-[16px] font-[600] text-white"
                        whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(3, 137, 255, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                        Download CV
                    </motion.button>

                    <ul className="flex gap-[34px] z-50">
                        {["Facebook", "Linkedin", "Behance", "Portfolio"].map((item) => (
                            <li key={item} className="text-[18px] flex gap-[10px]">
                                <img src={CRYSTAL} alt="Crystal" className="w-[22px] h-[22px]" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </motion.div>

                <ScrollVelocity
                    texts={['THAN NAUNG',]}
                    className="custom-scroll-text text-[#0389FF] h-[110px] mt-[80px]  text-[190px]"
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
                    <button className="h-12 px-6 rounded-full bg-blue-500 backdrop-blur-md border border-[#525252]/50 shadow-lg shadow-[#525252]/30 text-white font-medium hover:bg-blue-600 transition-colors">
                        Download CV
                    </button>
                </div>
            </motion.div>
        </motion.div>
    )
}