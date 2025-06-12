import { SearchIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import clsx from "clsx";

export const SearchBar = ({
  width,
  value,
  setValue,
}: {
  width?: "lg" | "md";
  value: any;
  setValue: any;
}) => {
  return (
    <div
      className={clsx(
        `h-[54px] bg-[#F3F4F6] p-2 rounded-[25px]   flex items-center justify-between`,
        width === "lg" && "w-[500px]"
      )}
    >
      <Input
        width={"w-full"}
        placeholder="What are you looking for?"
        className="border-none bg-[#F3F4F6] w-[300px] outline-none"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button className="bg-[#0389FF]  p-2 w-[38px] text-white h-[38px] rounded-full">
        <SearchIcon />
      </Button>
    </div>
  );
};
