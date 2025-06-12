import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import THAN from '@/assets/Login/Login/Mask group.png';

export const AvatarProfile = ({ size, status }: { size?: string, status: boolean }) => {
  return (
    <div className="relative">
      <Avatar className={cn(size)}>
        <AvatarImage className="object-cover" src={THAN} /> {/* Use the imported image here */}
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      {status && (
        <div className="w-[12px] h-[12px] border-2 bg-[#50F69C] rounded-full absolute right-0 bottom-0"></div>
      )}
    </div>
  );
};