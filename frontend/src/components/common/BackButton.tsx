import SvgBackChevron from "@/assets/svgs/SvgBackChevron";

const BackButton = ({ handleBack }: { handleBack: () => void }) => {
  return (
    <button
      title="Back "
      className="w-[62px] h-[62px]  rounded-full border-[1px] border-[#CBD5E1] flex items-center justify-center"
      onClick={handleBack}
    >
      <SvgBackChevron />
    </button>
  );
};

export default BackButton;
