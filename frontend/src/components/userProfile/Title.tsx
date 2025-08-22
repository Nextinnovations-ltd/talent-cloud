/* eslint-disable @typescript-eslint/ban-ts-comment */
import { motion } from 'framer-motion';
import CRYSTAL from '@/assets/Login/Vector.svg';
import ActiveActionsButtons from './ActiveActionsButtons';
import SvgAdd from '@/assets/svgs/SvgAdd';
import SvgEdit from '@/assets/svgs/SvgEdit';

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

export const Title = ({ title, isEdit, onEditToggle, onpressAdd, isTitle = true, showAddButton = true }: { title: string; isEdit?: boolean; onEditToggle?: () => void, onpressAdd?: () => void, isTitle?: boolean, showAddButton?: boolean }) => {
    return (
        <motion.div
            className="flex items-center justify-between gap-[10px] mb-[43px]"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {
                isTitle && <div className='flex items-center gap-4'>
                    <motion.h3
                        className="text-[32px] font-[600]"
                        //@ts-ignore
                        variants={textVariants}
                    >
                        {title}
                    </motion.h3>

                    <motion.img
                        src={CRYSTAL}
                        alt="Crystal"
                        className="translate-y-[-30px]"
                        //@ts-ignore
                        variants={crystalVariants}
                        initial="hidden"
                        animate={["visible", "pulse"]}
                        whileHover="hover"
                    />
                </div>
            }

            {
                !isTitle && <div></div>
            }

            <div className='flex items-center  gap-5'>
                {showAddButton && (
                    <ActiveActionsButtons onClick={onpressAdd} icon={<SvgAdd />} title='Add' />
                )}
                {onEditToggle && (
                    <ActiveActionsButtons
                        icon={<SvgEdit />}
                        title={isEdit ? 'Cancel' : 'Edit'}
                        onClick={onEditToggle}
                    />
                )}
            </div>

        </motion.div>
    );
};