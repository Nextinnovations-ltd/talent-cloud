/* eslint-disable @typescript-eslint/ban-ts-comment */

import { useNavigate } from 'react-router-dom';
import { Title } from '../Title'
import { motion } from 'framer-motion'
import { useDeleteVideoIntroductionMutation, useGetVideoIntroductionQuery } from '@/services/slices/jobSeekerSlice';
import useToast from '@/hooks/use-toast';
import EMPTYVIDEO from '@/assets/Login/EmptyVideo.png';
import { EmptyData } from '@/components/common/EmptyData';

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

interface VideoIntroductionSectionProps {
    isVideoIntroductionEdit: boolean;
    setIsVideoIntroductionEdit: React.Dispatch<React.SetStateAction<boolean>>;
}


const VideoIntroductionSection: React.FC<VideoIntroductionSectionProps> = ({
    isVideoIntroductionEdit,
    setIsVideoIntroductionEdit
}) => {

    const navigate = useNavigate();
    const { data } = useGetVideoIntroductionQuery();
    const [deleteVideo] = useDeleteVideoIntroductionMutation();
    const { showNotification } = useToast();
    const handleDelete = async () => {
        try {
            await deleteVideo().unwrap();
            showNotification({ message: 'Video introduction deleted successfully', type: 'success' });
        } catch {
            showNotification({ message: 'Failed to delete video introduction', type: 'danger' });
        }
    }
    const handleEdit = () => {
        setIsVideoIntroductionEdit((prev) => !prev)
        navigate('/user/edit/video-introduction?mode=edit')
    }



    return (
        <>
            <Title
                title={"Video Introduction"}
                onpressAdd={() => navigate(`/user/edit/video-introduction`)}
                isEdit={isVideoIntroductionEdit}
                onEditToggle={data?.data?.video_url ? handleEdit : undefined}
                showAddButton={!data?.data?.video_url}
                onDelete={data?.data?.video_url ? handleDelete : undefined}
            />

        {(!data?.data || !data.data.video_url ) ? (
                <EmptyData
                    image={<img src={EMPTYVIDEO} alt="Video Introduction" style={{ width: '100%', height: '100%', objectFit: 'cover',opacity:0.8 }} />}
                    title="Video Introduction"
                    description="This user does not have any video yet."
                />
            ) : <motion.div
                className='mb-[70px] px-[100px]'
                //@ts-ignore
                variants={itemVariants}
            >
                <iframe width="100%" height="515" src={data?.data?.video_url} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ></iframe>
            </motion.div>}

        </>
    )
}

export default VideoIntroductionSection