import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CandidateTabsProps {
    favourite: number;
    tabValues: string;
    setTabValues: React.Dispatch<React.SetStateAction<string>>;
    totalApplicants: number;
}

const CandidateTabs: React.FC<CandidateTabsProps> = ({
    tabValues,
    setTabValues,
    favourite,
    totalApplicants
}) => {
    return (
        <Tabs value={tabValues} onValueChange={setTabValues} className="w-[400px]">
            <TabsList className="h-[50px]">
                <TabsTrigger className="px-[24px] py-[10px]" value="all">
                    All Candidates
                </TabsTrigger>
                <span className="w-[48px] ml-[8px] h-[48px] rounded-full bg-[#CAE6FF] flex items-center justify-center text-[#0389FF]">
                    {totalApplicants}
                </span>

                <TabsTrigger className="px-[24px] ml-[35px] py-[10px]" value="favourite">
                    Favorites
                    <span className="w-[48px] ml-[8px] h-[48px] rounded-full bg-[#CAE6FF] flex items-center justify-center text-[#0389FF]">
                        {favourite}
                    </span>
                </TabsTrigger>
            </TabsList>
        </Tabs>
    )
}

export default CandidateTabs;