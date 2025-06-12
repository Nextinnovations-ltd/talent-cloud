import clsx from "clsx";
import React from "react";

interface SpecializationCardProps {
  title: string; // The title of the card
  SVGImg: React.ReactNode; // Use React.ReactNode for better type safety
  active?: boolean; // Whether the card is active
  handleClick: () => void; // Function to handle click events
}

export const SpecializationCard: React.FC<SpecializationCardProps> = ({
  title,
  SVGImg,
  active,
  handleClick,
}) => {
  return (
    <div
      onClick={handleClick}
      className={clsx(
        "w-[306px]  cursor-pointer rounded-[14px] flex items-center justify-start gap-[21px] px-5  h-[116px] transition-all duration-500",
        "md:hover:translate-y-[-5px] md:hover:shadow-md", // Hover effects for larger screens
        active && "border border-[#0389FF] bg-[#0389FF26]",
        !active && "bg-white border-[#CBD5E1] border ",
        "hover:border-[#0389FF] hover:bg-[#0389FF26]" // Hover state styles
      )}
    >
      {SVGImg}
      <p className="text-base font-medium">{title}</p>
    </div>
  );
};