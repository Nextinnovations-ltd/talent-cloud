import { BackGroundGrid } from '@/constants/svgs';
import { AvatarProfile } from '../common/Avatar';
import SHADOWLEFT from '@/assets/Login/ShadowLeft.svg';
import SHADOWRIGHT from '@/assets/Login/ShadowRight.svg';
import EDITPEN from '@/assets/Login/Edit.svg';
import EYE from '@/assets/Login/Eye.svg';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import { useGetJobSeekerProfileQuery } from '@/services/slices/jobSeekerSlice';
import StarBorder from '../common/StarBorder';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      when: "beforeChildren"
    }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const scaleUp = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "backOut"
    }
  }
};

// Utility function to calculate age from date string
function calculateAge(dateString: string): number | null {
  if (!dateString) return null;
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export const UserProfile = () => {

  const {
    data: profileData,
    isLoading: isProfileLoading,
  } = useGetJobSeekerProfileQuery();

  const userData = profileData?.data;

  // Skeleton/placeholder for loading state
  if (isProfileLoading) {
    return (
      <div className="flex flex-col items-center mt-[80px]">
        <div className="animate-pulse w-[164px] h-[164px] rounded-full bg-gray-200 mb-6" />
        <div className="h-10 w-1/3 bg-gray-200 rounded mb-4 animate-pulse" />
        <div className="h-6 w-1/4 bg-gray-200 rounded mb-2 animate-pulse" />
        <div className="flex gap-4 mt-6">
          <div className="w-32 h-12 bg-gray-200 rounded animate-pulse" />
          <div className="w-32 h-12 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex gap-6 mt-10 w-full max-w-[1104px] justify-center">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center w-40 h-24 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="h-8 w-2/3 bg-gray-200 rounded mt-10 animate-pulse" />
      </div>
    );
  }

  // Handle missing user data
  if (!userData) {
    return (
      <div className="flex flex-col items-center mt-[80px]">
        <p className="text-lg text-gray-500">User profile not found.</p>
      </div>
    );
  }

  return (
    <>
      <motion.div
        className='relative h-[400px] flex mt-[80px] flex-col items-center justify-center'
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Background elements with subtle animations */}
        <motion.img
          src={SHADOWLEFT}
          className='absolute left-0 z-50 top-[-170px]'
          variants={fadeIn}
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
        <motion.img
          src={SHADOWRIGHT}
          className='absolute right-0 z-50 top-[-170px]'
          variants={fadeIn}
          initial={{ x: 50 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />

        <motion.div
          className='absolute bottom-0 right-0 left-0 z-20'
          variants={fadeIn}
        >
          <BackGroundGrid />
        </motion.div>

        {/* Main content with staggered animations */}
        <motion.p
          className='text-[84px] poppins-semibold  font-extrabold z-30 uppercase'
          variants={scaleUp}
        >
          {userData?.name || '--'}
        </motion.p>

        <motion.div
          variants={scaleUp}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AvatarProfile
            size='w-[164px] z-30 h-[164px] border-[5px] border-white'
            status={false}
          />
        </motion.div>

        <motion.h3
          className='text-[20px] mt-[30px] font-[500] z-30'
          variants={itemVariants}
        >
          {userData?.tagline || '--'}
        </motion.h3>

        <motion.div
          className='gap-[14px] mt-[30px] flex justify-center items-center z-30'
          variants={itemVariants}
        >
          <IconPreviewButton />
          <IconButton />
        </motion.div>
      </motion.div>
      <motion.h3
        className="mt-[60px] text-center flex justify-center items-center gap-2"
        variants={itemVariants}
      >
        <motion.div
          className="w-[25px] h-[25px] bg-[#0DDE3433] rounded-full flex items-center justify-center"
          animate={{
            scale: [1, 1.3, 1],
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
      
      <motion.div
        className='flex max-w-[1104px] mx-auto gap-[24px] mt-[40px] mb-[50px]'
        variants={itemVariants}
      >
        <StarBorder as="button" color="#0389FF" speed="4s">
          <h1 className='text-[30px] font-[500]'>
            {userData?.experience_level?.level || "--"}
          </h1>
          <p className='text-[14px]'>Experience Level</p>
        </StarBorder>
        <StarBorder as="button" color="#0389FF" speed="4s">
          <h1 className='text-[30px] font-[500]'>
            {userData?.experience_years ?? "--"}
          </h1>
          <p className='text-[14px]'>Years of Experience</p>
        </StarBorder>
        <StarBorder as="button" color="#0389FF" speed="4s">
          <h1 className='text-[30px] font-[500]'>
            {userData?.role?.name || "--"}
          </h1>
          <p className='text-[14px]'>Specialization Type</p>
        </StarBorder>
        <StarBorder as="button" color="#0389FF" speed="4s">
          <h1 className='text-[30px] font-[500]'>
            {userData?.date_of_birth ? calculateAge(userData.date_of_birth) : "--"}
          </h1>
          <p className='text-[14px]'>Age</p>
        </StarBorder>
      </motion.div>
      <motion.h3
        className='text-[24px] text-center max-w-[1104px] mx-auto mb-[70px]'
        variants={itemVariants}
      >
        {userData?.bio || 'No bio provided.'}
      </motion.h3>
    </>
  );
}

const avatarData = [
  {
    src: 'https://images.unsplash.com/photo-1742319892607-ff9d59863f1f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Free Image 1',
  },
  {
    src: 'https://images.unsplash.com/photo-1742319892607-ff9d59863f1f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Free Image 2',
  },
  {
    src: 'https://plus.unsplash.com/premium_photo-1669357657874-34944fa0be68?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZnJlZSUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D',
    title: 'Free Image 3',
  },
];

const ToolTips = () => {
  return (
    <div className="flex items-center">
      {avatarData.map((avatar, index) => (
        <motion.img
          key={index}
          whileHover={{ scale: 1.2, zIndex: 10 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className={`w-[32px] h-[32px] rounded-full object-cover border-2 hover:scale-110 ${index !== 0 ? 'ml-[-20px]' : ''
            }`}
          src={avatar.src}
          title={avatar.title}
          alt={`Avatar ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default ToolTips;

const IconButton = () => {
  return (
    <Link to={'/user/edit/profile'}>
      <motion.button
        className='w-[118px] h-[48px] bg-[#0389FF] flex items-center justify-center gap-[5px] rounded-[8px] text-[16px] font-[600] text-white z-40'
        whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(3, 137, 255, 0.3)" }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <img src={EDITPEN} />
        Edit
      </motion.button></Link>
  )
}

const IconPreviewButton = () => {
  return (
    <motion.button
      className='w-[118px] h-[48px] bg-[#FFFFFF] border-[#CBD5E1] flex items-center justify-center gap-[5px] rounded-[8px] text-[16px] font-[600] text-[#05060F] border-[1px] drop-shadow z-40'
      whileHover={{
        scale: 1.05,
        backgroundColor: "#f8fafc",
        boxShadow: "0px 5px 15px rgba(203, 213, 225, 0.3)"
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <img src={EYE} />
      Preview
    </motion.button>
  )
}