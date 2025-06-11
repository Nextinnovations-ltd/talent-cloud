import BG from '@/assets/bg.svg';
import { Button } from '../ui/button';
import { BLUEMARK, CAMERA, MORE } from '@/constants/svgs';
import { AvatarProfile } from '../common/Avatar';
import { Link } from 'react-router-dom';
import routesMap from '@/constants/routesMap';


export const UserInfo = () => {

    return (
        <>
            <UserProfileImage />
            <div className='px-[50px]'>
                <div className='  flex justify-start items-end relative '>
                    <AvatarProfile size='w-[164px] mt-[-170px] h-[164px] border-[5px] border-white' status={false} />
                    <div className='mb-[12px] ml-[24px] mt-[20px]   flex flex-col  '>
                        <h3 className=' font-semibold text-[24px]   flex items-center gap-[8.7px]'>Than Naung <BLUEMARK /></h3>
                        <p className='text-[18px] mt-[4px]  text-[#6B6B6B]'>UI/UX Designer</p>
                        <div className='mt-[16px] flex items-center gap-[10px]'>
                            <p>0 <span className='text-[#6B6B6B]'>Following</span></p>
                            <div className='w-[4px] h-[4px] bg-[#6B6B6B] rounded-full'></div>
                            <p>0 <span className='text-[#6B6B6B]'>Followers</span></p>
                        </div>
                    </div>
                    <div className='absolute right-0 top-[30px] flex items-center  gap-[27px]'>
                     <Link to={`/user/edit/${routesMap?.profile.path}`}>
                     <Button  className='w-[117px] h-[48px] font-bold border-[#CBD5E1] shadow bg-white' variant={'outline'}>Edit Profile</Button>
                     </Link>
                        <MORE />
                    </div>
                </div>
                <p className='text-[#3F3D51] max-w-[776px] mt-[20px] text-[16px] leading-7'>Experienced UI/UX Designer with a passion for crafting intuitive and visually appealing digital experiences. Skilled in user research, wireframing, prototyping, and visual design. Proven ability to deliver innovative solutions that meet user needs and business objectives. With over... Read more</p>
            </div>
        </>
    );
};

const UserProfileImage = () => {
    return (
        <div className=" h-[240px] rounded-[25px] relative">
            <img
                title='User profile'
                src={BG}
                alt="User background"
                className="w-full h-full object-cover"
            />
            <Button
                title='Edit profile'
                className="bg-white absolute rounded-full top-[22px] right-[22px] w-[44px] h-[44px] p-0 hover:scale-110 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Upload or change background image"
            >
                <CAMERA />
            </Button>
        </div>
    )
}