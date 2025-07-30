import AnalyticalBarChart from "./analyticalBarChart";
import AnalyticalChartsCardsContainer from "./analyticalChartsCards";
import AnalyticalPieChart from "./analyticalPieChart";


const AnalyticalCharts = () => {
    return (
        <div className="mt-[66px] flex w-full gap-5">
            <div className="w-[50%]">
               <AnalyticalChartsCardsContainer/>
               <div className="border border-[#CBD5E1] rounded-[12px] mt-4">
                <AnalyticalPieChart/>
               </div>
            </div>
            <div className="w-[50%] border border-[#CBD5E1] rounded-[12px]">
             <AnalyticalBarChart/>
            </div>

        </div>
    )
}

export default AnalyticalCharts;