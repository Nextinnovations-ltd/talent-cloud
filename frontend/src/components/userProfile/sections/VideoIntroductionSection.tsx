
import { useNavigate } from 'react-router-dom';
import { Title } from '../Title'
import { motion } from 'framer-motion'


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


const VideoIntroductionSection = () => {

    const navigate = useNavigate();

    return (
        <>
            <Title title={"Video Introduction"} onpressAdd={()=>navigate(`/user/edit/video-introduction`)} />

            <motion.div
                className='mb-[70px] px-[100px]'
                variants={itemVariants}
            >
                <iframe width="100%" height="515" src="https://www.youtube.com/embed/H85zpTco5Ek?si=eo6dmxDxrZDyJPFP" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ></iframe>
            </motion.div>
        </>
    )
}

export default VideoIntroductionSection