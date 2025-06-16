import MEGAPHONE from '@/assets/Megaphone.png';

 const ApplyJobHero = () => {
  return (
    <div className="container  mt-[64px] rounded-[10px] mx-auto mb-[50px] items-center gap-[8px]  p-4 flex flex-col  justify-center">
        <p className='text-[14px]'>Personalized Picks</p>

       <div className='flex gap-5 items-center'>
       <h3 className="text-[64px] font-semibold">Jobs Market</h3>
       <img width={65} src={MEGAPHONE}/>
       </div>

        <p className="w-[280px] text-[18px]  text-center">Find the right job opportunities that 
        match your passion.</p>
    </div>
  )
}

export default ApplyJobHero;
