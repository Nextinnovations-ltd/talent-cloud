import clsx from "clsx";

export const SubSepcializationCard = ({
  name,
  handleClick,
  active,
}: {
  name: string;
  handleClick: any;
  active: boolean;
}) => {
  return (
    <div
      onClick={handleClick}
      className={clsx(
        "w-[220px] border-[1px]  md:hover:translate-y-[-5px] cursor-pointer md:hover:shadow-md duration-500 h-[116px] rounded-[14px] text-center px-5  flex items-center justify-center",
        "hover:border-[#0389FF] hover:bg-[#0389FF26]",
        active && "border-[#0389FF] bg-[#0389FF26]",
        !active && "border-[#CBD5E1] bg-[#ffffff] "
      )}
    >
      <p className=" capitalize">{name}</p>
    </div>
  );
};
