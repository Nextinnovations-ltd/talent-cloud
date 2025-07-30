import SvgDownChevron from '@/assets/svgs/SvgDownChevron';
import { Button } from '@/components/ui/button';

type SortsButtonProps = {
    title:string
}

 const SortsButtons = ({title}:SortsButtonProps) => {
  return (
    <Button className=' px-7 h-[48px]  rounded-[20px] bg-[#F3F4F6]'><p className='text-[#575757]'>{title}</p>
    <SvgDownChevron/>
    </Button>
  )
}

export default SortsButtons;