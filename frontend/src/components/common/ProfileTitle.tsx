import { Separator } from "../ui/separator";

export const ProfileTitle = ({ title }: { title: string }) => {
  return (
    <div className="mb-[24px] space-y-[24px] rounded-md w-[100%] h-full">
      <h3 className=" font-medium text-[24px]">{title}</h3>
      <Separator />
    </div>
  );
};
