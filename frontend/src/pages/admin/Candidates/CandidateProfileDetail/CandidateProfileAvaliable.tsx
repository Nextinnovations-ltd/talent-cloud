/* eslint-disable @typescript-eslint/ban-ts-comment */

import { motion } from "framer-motion";

const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } }
};


const CandidateProfileAvaliable = () => {
    return (
        <motion.h3
            className="text-center  text-[#6B6B6B] flex justify-start gap-2 items-center "
            //@ts-expect-error
            variants={itemVariants}
        >
            <motion.div
                className="w-[20px] h-[20px] bg-[#0DDE3433] rounded-full flex items-center justify-center"
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [1, 0.8, 1],
                    rotate: [0, 5, -5, 0],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "anticipate",
                    repeatType: "reverse",
                    times: [0, 0.5, 1],
                }}
            >
                <motion.div
                    className="w-[8px] h-[8px] bg-[#0DDE34] rounded-full"
                    animate={{
                        scale: [1, 0.9, 1],
                        opacity: [1, 0.9, 1],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </motion.div>
            Available for work
        </motion.h3>
    )
}

export default CandidateProfileAvaliable