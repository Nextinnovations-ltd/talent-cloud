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
import { JobSeekerCountResponse } from "@/types/admin-auth-slice"
import { Skeleton } from "@/components/ui/skeleton"

function AnalyticalPieChart({ data, loading }: { data: JobSeekerCountResponse | undefined, loading: boolean }) {
    const defaultData = {
        job_post_active: { count: 0, percent: 0 },
        job_post_expired: { count: 0, percent: 0 },
        total_job_posts: 0
    }

    const chartData = [
        {
            status: "Active",
            count: data?.data?.job_post_active.count ?? defaultData.job_post_active.count,
            fill: "var(--color-chrome)",
            percent: data?.data?.job_post_active.percent ?? defaultData.job_post_active.percent
        },
        {
            status: "Expired",
            count: data?.data?.job_post_expired.count ?? defaultData.job_post_expired.count,
            fill: "var(--color-safari)",
            percent: data?.data?.job_post_expired.percent ?? defaultData.job_post_expired.percent
        },
    ]

    const chartConfig = {
        count: {
            label: "Count",
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

    const totalJobs = data?.data?.total_job_posts ?? defaultData.total_job_posts

    return (
        <Card className="flex border-none shadow-none p-[24px] flex-col">
            <h3 className="text-[20px] font-semibold pl-5 w-full">Job Overview</h3>
            <CardContent className="flex-1 px-0 pb-0">
                {
                    loading ? (
                        <div className="flex gap-[48px] items-center">
                            <Skeleton className="h-[250px] w-[250px] rounded-full" />
                            <div className="space-y-4">
                                <Skeleton className="h-6 w-[150px]" />
                                <Skeleton className="h-6 w-[180px]" />
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-[48px] items-center">
                            <ChartContainer
                                config={chartConfig}
                                className="aspect-square h-[250px]"
                            >
                                <PieChart>
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel />}
                                    />
                                    <Pie
                                        data={chartData}
                                        dataKey="count"
                                        nameKey="status"
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
                                                                {totalJobs.toLocaleString()}
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
                                <AnalyticalActiveItems
                                    percent={chartData[0].percent}
                                    job={chartData[0].count}
                                    status="Active"
                                />
                                <AnalyticalActiveItems
                                    percent={chartData[1].percent}
                                    job={chartData[1].count}
                                    status="Expired"
                                />
                            </div>
                        </div>
                    )
                }
            </CardContent>
        </Card>
    )
}

interface AnalyticalActiveItemsProps {
    percent: number;
    job: number;
    status: "Active" | "Expired";
}

function AnalyticalActiveItems({ percent, job, status }: AnalyticalActiveItemsProps) {
    const color = status === "Active" ? "#0481EF" : "#5caef7";

    return (
        <div className="mb-4">
            <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></div>
                <h3 className="text-[14px]">{status} Jobs</h3>
            </div>
            <div className="flex text-[12px] text-[#575757] pl-5 items-center gap-2">
                {percent}%
                <div className="flex items-center gap-2">
                    <div className="w-[4px] h-[4px] bg-[#575757] rounded-full"></div>
                    <h3>{job} {status} Jobs</h3>
                </div>
            </div>
        </div>
    )
}

export default AnalyticalPieChart
