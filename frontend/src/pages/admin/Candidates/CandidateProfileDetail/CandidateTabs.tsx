import SvgCertifications from "@/assets/svgs/SvgCertifications";
import SvgEducation from "@/assets/svgs/SvgEducation";
import SvgExperience from "@/assets/svgs/SvgExperience";
import SvgOverView from "@/assets/svgs/SvgOverView";
import SvgProjects from "@/assets/svgs/SvgProjects";
import SvgVideo from "@/assets/svgs/SvgVideo";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { useState } from "react";
import OverView from "./CandidateTabs/OverView";
import Projects from "./CandidateTabs/Projects";
import Video from "./CandidateTabs/Video";
import Experience from "./CandidateTabs/Experience";
import Educations from "./CandidateTabs/Educations";
import Certifications from "./CandidateTabs/Certifications";

const TABSDATAS = [
    { id: 1, name: "Overview", value: "overview", Icon: SvgOverView, component: OverView },
    { id: 2, name: "Projects", value: "projects", Icon: SvgProjects, component: Projects },
    { id: 3, name: "Video", value: "video", Icon: SvgVideo, component: Video },
    { id: 4, name: "Experience", value: "experience", Icon: SvgExperience, component: Experience },
    { id: 5, name: "Educations", value: "education", Icon: SvgEducation, component: Educations },
    { id: 6, name: "Certifications", value: "certifications", Icon: SvgCertifications, component: Certifications },
];

const CandidateTabs = () => {
    const [value, setValue] = useState("overview");

    return (
        <div className="flex w-full mt-[100px] pb-[100px] flex-col gap-6">
            <Tabs value={value} onValueChange={setValue} defaultValue="overview" className="w-full  h-full">
                <TabsList className="gap-[5px] flex flex-wrap">
                    {TABSDATAS.map((tab) => {
                        const Icon = tab.Icon;
                        return (
                            <TabsTrigger
                                key={tab.id}
                                value={tab.value}
                                className="gap-2 px-[24px]   py-[12px] flex items-center"
                            >
                                <Icon color={value === tab.value ? "#0481EF" : "#575757"} />
                                <p>{tab.name}</p>
                            </TabsTrigger>
                        );
                    })}
                </TabsList>

                {TABSDATAS.map((tab) => {
                    const Component = tab.component;
                    return (
                        <TabsContent
                            key={tab.id}
                            value={tab.value}
                            className="w-full h-full flex-1"
                        >
                            <Component />
                        </TabsContent>
                    );
                })}
            </Tabs>
        </div>
    );
};

export default CandidateTabs;
