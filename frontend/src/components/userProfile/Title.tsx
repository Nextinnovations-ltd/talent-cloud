import { motion } from 'framer-motion';
import CRYSTAL from '@/assets/Login/Vector.svg';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3,
        }
    }
};

const textVariants = {
    hidden: {
        y: 20,
        opacity: 0,
        rotate: -2,
    },
    visible: {
        y: 0,
        opacity: 1,
        rotate: 0,
        transition: {
            type: "spring",
            damping: 10,
            stiffness: 100,
            mass: 0.5,
        }
    }
};

const crystalVariants = {
    hidden: {
        scale: 0.5,
        opacity: 0,
        rotate: -45,
    },
    visible: {
        scale: 1,
        opacity: 1,
        rotate: 0,
        transition: {
            type: "spring",
            damping: 10,
            stiffness: 200,
            delay: 0.5,
        }
    },
    hover: {
        scale: 1.2,
        rotate: [0, 10, -10, 0],
        transition: {
            duration: 1,
            ease: "easeInOut"
        }
    },
    pulse: {
        scale: [1, 1.1, 1],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

export const Title = ({ title }: { title: string }) => {
    return (
        <motion.div
            className="flex items-center justify-start gap-[10px] mb-[43px]"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.h3
                className="text-[40px] font-[600]"
                variants={textVariants}
            >
                {title}
            </motion.h3>

            <motion.img
                src={CRYSTAL}
                alt="Crystal"
                className="translate-y-[-30px]"
                variants={crystalVariants}
                initial="hidden"
                animate={["visible", "pulse"]}
                whileHover="hover"
            />
        </motion.div>
    );
};