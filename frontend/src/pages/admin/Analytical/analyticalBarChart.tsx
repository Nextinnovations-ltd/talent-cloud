import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A bar chart with a label"

const chartData = [
    { month: "January", jobSeeker: 186 },
    { month: "February", jobSeeker: 305 },
    { month: "March", jobSeeker: 237 },
    { month: "April", jobSeeker: 73 },
    { month: "May", jobSeeker: 209 },
    { month: "June", jobSeeker: 214 },
]

const chartConfig = {
    jobSeeker: {
        label: "Jobseekers",
        color: "#0481EF",
    },

} satisfies ChartConfig

function AnalyticalBarChart() {
    return (
        <Card className="border-none shadow-none">
            <CardHeader >
                <CardTitle className="text-[20px] p-0 m-0 font-semibold">Total Jobseeker</CardTitle>
                <CardDescription className="m-0 p-0 text-[12px]">Show by registered  user</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            top: 20,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="jobSeeker" fill="var(--color-desktop)" radius={0}>
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={
                                        [
                                            "#0481EF", // January
                                            "#DB7323", // February
                                            "#34A353", // March
                                            "#FF571F", // April
                                            "#C837AB", // May
                                            "#D4D12D", // June
                                        ][index]
                                    }
                                />
                            ))}
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground font-semibold"
                                fontSize={12}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="grid grid-cols-3 mt-10 ml-4  flex-wrap items-center  gap-2 text-sm">
              <AnalyticalActiveItems/>
              <AnalyticalActiveItems/>
              <AnalyticalActiveItems/>
              <AnalyticalActiveItems/>
              <AnalyticalActiveItems/>
              <AnalyticalActiveItems/>
            </CardFooter>
        </Card>
    )
}


function AnalyticalActiveItems({color,text}: {color?:string,text?:string}) {
    return (
        <div className="flex items-center gap-1">
            <div className="w-[10px] h-[10px] bg-[#0481EF] rounded-full "></div>
            <h3 className="text-[10px]">Active  Jobs</h3>
        </div>
    )
}


export default AnalyticalBarChart;