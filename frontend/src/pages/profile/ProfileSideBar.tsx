import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  PROFILE,
  EDUCATIONOUTLINE,
  WORKEXPERIENCEOUTLINE,
  PROFILEFILL,
  WORKEXPERIENCEFILL,
  EDUCATIONFILL,
  SKILLOUTLINE,
  SKILLFILL,
  CERTIFICATIONSOUTLINE,
  CERTIFICATIONSFILL,
  RESUME,
  RESUMEFILL,
  PROJECTS,
  PROJECTSFILL
} from "@/constants/svgs";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";

// Sidebar items data
const items = [
  {
    title: "Profile",
    url: "/user/edit/profile",
    icon: PROFILE, // Outline icon
    hoverIcon: PROFILEFILL, // Filled icon
  },
  {
    title: "Resume",
    url: "/user/edit/resume",
    icon: RESUME, // Outline icon
    hoverIcon: RESUMEFILL, // Filled icon
  },
  {
    title: "Skills",
    url: "/user/edit/skills",
    icon: SKILLOUTLINE, // Outline icon
    hoverIcon: SKILLFILL, // Filled icon
  },
  {
    title: "Project",
    url: "/user/edit/project",
    icon: PROJECTS, // Outline icon
    hoverIcon: PROJECTSFILL, // Filled icon
  },
  {
    title: "Work Experience",
    url: "/user/edit/workexperience",
    icon: WORKEXPERIENCEOUTLINE, // Outline icon
    hoverIcon: WORKEXPERIENCEFILL, // Filled icon
  },
  {
    title: "Education",
    url: "/user/edit/education",
    icon: EDUCATIONOUTLINE, // Outline icon
    hoverIcon: EDUCATIONFILL, // Filled icon
  },
  {
    title: "Certifications",
    url: "/user/edit/certifications",
    icon: CERTIFICATIONSOUTLINE, // Outline icon
    hoverIcon: CERTIFICATIONSFILL, // Filled icon
  },
  // {
  //   title: "Languages",
  //   url: "/user/edit/languages",
  //   icon: LANGUAGEFILL, // Outline icon
  //   hoverIcon: LANGUAGEFILL, // Filled icon
  // },
  // {
  //   title: "Social Links",
  //   url: "/user/edit/sockial-links",
  //   icon: SOCIALLINK, // Outline icon
  //   hoverIcon: SOCIALLINK, // Filled icon
  // },
];

export const ProfileSideBar = () => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <Sidebar className=" fixed top-[90px] left-[55px] max-h-[600px]  p-3  border-none  rounded-lg w-[285px]">
      <SidebarContent className="bg-white min-h-[80svh]  pr-[22px] ">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                    <SidebarMenuItem
                      onMouseEnter={() => setHoveredItem(item.title)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`h-[56px] rounded-lg ${
                        isActive ? "bg-gray-100" : "hover:bg-gray-50"
                      }`}
                    >
                      <SidebarMenuButton
                        className="h-[56px] flex items-center gap-[14px] duration-300 font-semibold"
                        asChild
                      >
                        <Link
                          to={item.url}
                          className="flex text-[#575757] items-center gap-[14px]"
                        >
                          <div
                            className="w-6 h-6"
                          >
                            {isActive ? (
                              <item.hoverIcon /> // Filled icon when active
                            ) : hoveredItem === item.title ? (
                              <item.hoverIcon /> // Filled icon when hovered
                            ) : (
                              <item.icon /> // Outline icon by default
                            )}
                          </div>
                          <span className={clsx(isActive && "text-[#0C0C12] font-semibold")} >{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
