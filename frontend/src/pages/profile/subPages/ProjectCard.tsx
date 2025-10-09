import SvgClock from "@/assets/svgs/SvgClock";
import SvgDelete from "@/assets/svgs/SvgDelete";
import SvgEdit from "@/assets/svgs/SvgEdit";
import SvgGroups from "@/assets/svgs/SvgGroups";
import SvgLink from "@/assets/svgs/SvgLink";

const ProjectCard = () => {
  const tags = [
    "Figma",
    "Research",
    "Interaction Design",
    "Prototyping",
    "Usability",
    "UX Audit",
  ];

  return (
    <div className="border border-[#CFD1D4] p-5 mt-5 rounded-[12px] relative bg-white  transition-all duration-200">
      <div className="flex items-start justify-between">
        {/* Project Info */}
        <div className="flex gap-5 items-start">
          <img
            width={140}
            height={117}
            className="rounded-[8px] object-cover"
            src="https://static0.xdaimages.com/wordpress/wp-content/uploads/2021/05/Google-Photos-logo-on-gradient-background-with-Google-colors.jpg"
          />
          <div>
            <h3 className="text-[18px] mb-[11px] font-semibold text-gray-800">
              Project Title
            </h3>
            <p className="text-[13px] text-[#6B6B6B] max-w-[500px] leading-[1.5]">
              Contrary to popular belief, Lorem Ipsum is not simply random text.
              It has roots in a piece of classical Latin literature from 45 BC,
              making it over 2000 years old.
            </p>

            <ul className="flex items-center gap-[40px] mt-[18px] text-[#6B6B6B] text-[12px]">
              <li className="flex items-center gap-[8px]">
                <SvgGroups /> 2
              </li>
              <li className="flex items-center gap-[8px]">
                <SvgClock /> 6 months
              </li>
              <li className="flex items-center gap-[8px]">
                <SvgLink /> Project link
              </li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button className="flex items-center justify-center gap-2 border border-[#D0D0D0] text-[12px] text-[#6B6B6B] w-[73px] h-[35px] rounded-xl hover:bg-gray-100 transition">
            <SvgEdit size={16} color="#6B6B6B" /> Edit
          </button>
          <button className="flex items-center justify-center gap-2 border border-[#D0D0D0] text-[12px] text-[#6B6B6B] w-[85px] h-[35px] rounded-xl hover:bg-gray-100 transition">
            <SvgDelete size={16} color="#6B6B6B" /> Delete
          </button>
        </div>
      </div>

      {/* Scrollable Tags */}
      <div
        className="flex gap-3 mt-5 overflow-x-auto scrollbar-hide scroll-smooth py-1"
      >
        {tags.map((tag, index) => (
          <button
            key={index}
            className="px-4 py-1.5 border border-[#CBD5E1] rounded-full text-[12px] text-gray-700 bg-white hover:bg-gray-100 active:scale-95 transition"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProjectCard;
