import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import {
    Card,
    CardContent,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A donut chart with text"

const chartData = [
    { browser: "Active", visitors: 275, fill: "var(--color-chrome)" },
    { browser: "Expired", visitors: 200, fill: "var(--color-safari)" },
]

const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    chrome: {
        label: "Active",
        color: "#0481EF",
    },
    safari: {
        label: "Expired",
        color: "#5caef7",
    },
} satisfies ChartConfig

function AnalyticalPieChart() {
    const totalVisitors = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
    }, [])

    return (
        <Card className="flex border-none shadow-none p-[24px] flex-col">
            <h3 className=" text-[20px] font-semibold pl-5 w-full">Job Overview</h3>
            <CardContent className="flex-1 px-0 pb-0">
                <div className="flex gap-[48px] items-center">
                    <ChartContainer
                        config={chartConfig}
                        className="aspect-square  h-[250px]"
                    >
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Pie
                                data={chartData}
                                dataKey="visitors"
                                nameKey="browser"
                                innerRadius={60}
                                strokeWidth={5}
                            >
                                <Label
                                    content={({ viewBox }) => {
                                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                            return (
                                                <text
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                >
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        className="fill-foreground text-3xl font-bold"
                                                    >
                                                        {totalVisitors.toLocaleString()}
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) + 24}
                                                        className="fill-muted-foreground"
                                                    >
                                                        Total Jobs
                                                    </tspan>
                                                </text>
                                            )
                                        }
                                    }}
                                />
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                    <div>
                        <AnalyticalActiveItems percent={63} job={70} />
                        <AnalyticalActiveItems percent={34} job={120} />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}


function AnalyticalActiveItems({ percent, job }: { percent: number, job: number }) {
    return (
        <div className="mb-4">
            <div className="flex items-center  gap-3">
                <div className="w-2 h-2 bg-[#0481EF] rounded-full "></div>
                <h3 className="text-[14px]">Active  Jobs</h3>
            </div>
            <div className="flex text-[12px] text-[#575757] pl-5 items-center gap-2">
                {percent}%
                <div className="flex items-center  gap-2">
                    <div className="w-[4px] h-[4px] bg-[#575757] rounded-full "></div>
                    <h3>{job} Active  Jobs</h3>
                </div>
            </div>
        </div>
    )
}


export default AnalyticalPieChart