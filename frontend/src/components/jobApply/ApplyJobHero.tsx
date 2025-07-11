import MEGAPHONE from '@/assets/Megaphone.png';

const floatVariants = (delay = 0, amplitude = 15, rotate = 4, duration = 5) => ({
  animate: {
    y: [0, -amplitude, 0, amplitude, 0],
    rotate: [0, -rotate, 0, rotate, 0],
    transition: {
      duration,
      repeat: Infinity,
      repeatType: 'loop' as const,
      ease: 'easeInOut',
      delay,
    },
  },
});

const ApplyJobHero = () => {
  return (
    <div className="relative container  rounded-[10px] mx-auto mb-[50px] items-center gap-[8px] p-4 flex flex-col justify-center">
     
      
       
      <p className='text-[14px]'>Personalized Picks</p>
      <div className='flex gap-5 items-center'>
        <h3 className="text-[64px] font-semibold">Jobs Market</h3>
        <img width={65} src={MEGAPHONE}/>
      </div>
      <p className="w-[280px] text-[18px] text-center">Find the right job opportunities that 
        match your passion.</p>
    </div>
  )
}

export default ApplyJobHero;
