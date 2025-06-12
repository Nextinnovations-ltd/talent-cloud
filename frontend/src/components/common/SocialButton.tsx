import { Button } from "../ui/button";
import { ReactNode } from "react";
import clsx from "clsx";
import { LoadingSpinner } from "./LoadingSpinner";

const SocialButtonCss =
  "shadow-none  text-base font-semibold w-full h-12 border border-bg-hr flex items-center justify-center gap-2 hover:bg-bg-hoverwhite active:bg-bg-activewhite my-4 text-[14px] md:text-[16px] ";

export const SocialButton: React.FC<SocialButtonType> = ({
  title,
  icon,
  handleClick,
  loading,
}: {
  title: string;
  icon: ReactNode;
  handleClick: any;
  loading: boolean;
}) => {
  return (
    <Button
      size={"lg"}
      type="button"
      className={clsx(SocialButtonCss)}
      onClick={handleClick}
    >
      {loading && <LoadingSpinner />}
      {!loading && icon}
      {!loading && title}
    </Button>
  );
};
