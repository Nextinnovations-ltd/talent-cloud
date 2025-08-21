import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import DEFAULT from '@/assets/ProfileNoData.png';

export const AvatarProfile = ({ size,src }: { size?: string,src?:string }) => {
  return (
    <div className="relative flex items-center justify-center gap-4">
      <Avatar className={cn(size)}>
        <AvatarImage className="object-cover" src={src? src :DEFAULT} /> {/* Use the imported image here */}
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
     
    </div>
  );
};