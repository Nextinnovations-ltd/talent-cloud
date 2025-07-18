import SvgBackChevron from "@/assets/svgs/SvgBackChevron";

 const BackButton = () => {
  return (
    <button title="Back " className="w-[62px] h-[62px]  rounded-full border-[1px] border-[#CBD5E1] flex items-center justify-center">
        <SvgBackChevron/>
    </button>
  )
}

export default BackButton;
