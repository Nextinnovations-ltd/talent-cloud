import clsx from "clsx";
import { useState, useRef, useEffect } from "react";

const CandidateDescription = ({ description }: { description?: string }) => {
  const [expanded, setExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);


  useEffect(() => {
    if (descriptionRef.current) {
      const isOverflowing =
        descriptionRef.current.scrollHeight > descriptionRef.current.clientHeight;
      setShowToggle(isOverflowing);
    }
  }, [description]);

  // Handle no description
  if (!description || description.trim() === "") {
    return (
      <p className="mt-[45px] text-[#9CA3AF] italic">
        No bio provided
      </p>
    );
  }

 

  return (
    <>
      <p
        ref={descriptionRef}
        className={clsx(
          "mt-[45px] text-[#3F3D51] leading-[28px] font-[16px] transition-all duration-300",
          expanded ? "line-clamp-none" : "line-clamp-4"
        )}
      >
        {description}
      </p>
      {showToggle && (
        <span
          onClick={() => setExpanded((prev) => !prev)}
          className="underline cursor-pointer text-[#3F3D51]"
        >
          {expanded ? "Read less" : "Read more"}
        </span>
      )}
    </>
  );
};

export default CandidateDescription;
