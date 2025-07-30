import AnalyticalCards from "@/components/common/Admin/AnalyticalCards";


const AnalyticalChartsCardsContainer = () => {
    return (
        <div className="flex w-full  gap-4">
            <AnalyticalCards title="Total Jobs Posted" count={52} />
            <AnalyticalCards title="Total Jobs Posted" count={52} />
        </div>
    )
}

export default AnalyticalChartsCardsContainer;
