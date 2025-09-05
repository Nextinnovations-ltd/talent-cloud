import { useGetDashboardAnalyticsQuery } from "@/services/slices/adminSlice";
import AnalyticalBarChart from "./analyticalBarChart";
import AnalyticalChartsCardsContainer from "./analyticalChartsCards";
import AnalyticalPieChart from "./analyticalPieChart";



const AnalyticalCharts = () => {

    const { data: dashboardAnalytics, isLoading: isAnalyticsLoading } = useGetDashboardAnalyticsQuery();
    



    return (
        <div className="mt-[66px] pr-5 flex w-full gap-5">
            <div className="w-[50%]">
                <AnalyticalChartsCardsContainer loading={isAnalyticsLoading} data={dashboardAnalytics} />
                <div className="border border-[#CBD5E1] rounded-[12px] mt-4">
                    <AnalyticalPieChart loading={isAnalyticsLoading} data={dashboardAnalytics} />
                </div>
            </div>
            <div className="w-[50%] border border-[#CBD5E1] rounded-[12px]">
                <AnalyticalBarChart />
            </div>

        </div>
    )
}

export default AnalyticalCharts;