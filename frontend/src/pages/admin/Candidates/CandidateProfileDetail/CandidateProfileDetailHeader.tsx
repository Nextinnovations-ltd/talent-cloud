import SvgChevronLeft from '@/assets/svgs/SvgChevronLeft';
import SvgMenu from '@/assets/svgs/SvgMenu';
import { Button } from '@/components/ui/button';
import { useNavigate } from "react-router-dom";

 const CandidateProfileDetailHeader = () => {

  const navigate = useNavigate();
  

  return (
    <div className='flex justify-between'>
    <Button onClick={()=>navigate(-1)} className='border-[1px] border-slate-300 p-0 shadow-none w-[48px] h-[48px] rounded-full'>
        <SvgChevronLeft  />
    </Button>

    <Button disabled className=' shadow-none'>
        <SvgMenu />
    </Button>
</div>
  )
}

export default CandidateProfileDetailHeader