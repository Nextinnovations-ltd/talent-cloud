/* eslint-disable @typescript-eslint/ban-ts-comment */
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
import { useGetDashboardRoleAnalyticsQuery } from "@/services/slices/adminSlice"

export const description = "A bar chart with a label"

const chartConfig = {
    jobSeeker: {
        label: "Jobseekers",
        color: "#0481EF",
    },
} satisfies ChartConfig

const COLORS = ["#0481EF", "#DB7323", "#34A353", "#FF571F", "#C837AB", "#D4D12D"]

function AnalyticalBarChart() {
    const { data: dashboardAnalyticsRole, isLoading: isAnalyticsRoleLoading } = useGetDashboardRoleAnalyticsQuery()

    // Prepare chartData dynamically, max 6 roles
    //@ts-ignore
    const chartData = dashboardAnalyticsRole?.data?.top_occupation_roles
        ?.slice(0, 6)
         //@ts-ignore
        .map((role) => ({
            role: role.role_name,
            jobSeeker: role.job_seeker_count,
        })) || []

    if (isAnalyticsRoleLoading) {
        return <div>Loading...</div>
    }

    return (
        <Card className="border-none shadow-none">
            <CardHeader>
                <CardTitle className="text-[20px] p-0 m-0 font-semibold">Total Jobseeker</CardTitle>
                <CardDescription className="m-0 p-0 text-[12px]">Show by registered user</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        margin={{ top: 20 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="role"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) =>
                                value.length > 12 ? value.slice(0, 12) + "..." : value
                            }
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="jobSeeker" fill="var(--color-desktop)" radius={0}>
                        {/* @ts-ignore */}
                            {chartData.map((_entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
            <CardFooter className="grid grid-cols-3 mt-10 ml-4 flex-wrap items-center gap-2 text-sm">
            {/* @ts-ignore */}
                {chartData.map((role, index) => (
                    <AnalyticalActiveItems
                        key={index}
                        color={COLORS[index % COLORS.length]}
                        label={role.role}
                    />
                ))}
            </CardFooter>
        </Card>
    )
}

function AnalyticalActiveItems({ color, label }: { color: string; label: string }) {
    return (
        <div className="flex items-center gap-1">
            <div className="w-[10px] h-[10px]" style={{ backgroundColor: color, borderRadius: "50%" }}></div>
            <h3 className="text-[10px]">{label}</h3>
        </div>
    )
}

export default AnalyticalBarChart
