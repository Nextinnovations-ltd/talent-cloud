import { motion } from "framer-motion";
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
  LANGUAGEFILL,
  SOCIALLINK,
} from "@/constants/svgs";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

// Sidebar items data
const items = [
  {
    title: "Profile",
    url: "/user/edit/profile",
    icon: PROFILE, // Outline icon
    hoverIcon: PROFILEFILL, // Filled icon
  },
  {
    title: "Skills",
    url: "/user/edit/skills",
    icon: SKILLOUTLINE, // Outline icon
    hoverIcon: SKILLFILL, // Filled icon
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
  {
    title: "Languages",
    url: "/user/edit/languages",
    icon: LANGUAGEFILL, // Outline icon
    hoverIcon: LANGUAGEFILL, // Filled icon
  },
  {
    title: "Social Links",
    url: "/user/edit/sockial-links",
    icon: SOCIALLINK, // Outline icon
    hoverIcon: SOCIALLINK, // Filled icon
  },
];

export const ProfileSideBar = () => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <Sidebar className=" fixed top-[90px] left-[100px] max-h-[600px]  p-3  border-none rounded-lg w-[250px]">
      <SidebarContent className="bg-white ">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <motion.div
                    key={item.title}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <SidebarMenuItem
                      onMouseEnter={() => setHoveredItem(item.title)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`h-[56px] rounded-lg ${
                        isActive ? "bg-gray-100" : "hover:bg-gray-50"
                      }`}
                    >
                      <SidebarMenuButton
                        className="h-[56px] flex items-center gap-[14px] duration-300 font-bold"
                        asChild
                      >
                        <Link
                          to={item.url}
                          className="flex items-center gap-[14px]"
                        >
                          <motion.div
                            className="w-6 h-6"
                            initial={false}
                            animate={{
                              scale:
                                isActive || hoveredItem === item.title
                                  ? 1.1
                                  : 1,
                            }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            {isActive ? (
                              <item.hoverIcon /> // Filled icon when active
                            ) : hoveredItem === item.title ? (
                              <item.hoverIcon /> // Filled icon when hovered
                            ) : (
                              <item.icon /> // Outline icon by default
                            )}
                          </motion.div>
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </motion.div>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
