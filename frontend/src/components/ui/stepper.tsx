import * as React from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import SvgCompleteStep from "@/assets/svgs/SvgCompleteStep"


interface StepProps {
    title: string
    description?: string
    isCompleted?: boolean
    isActive?: boolean
    step?: number
}

const Step: React.FC<StepProps> = ({ title, description, isCompleted, isActive, step }) => {
    return (
        <div className="flex items-center flex-shrink-0">
            <div className="relative flex items-center justify-center">
                <div
                    className={cn(
                        "w-[47px] bg-[#D9D9D9] h-[47px] rounded-full flex items-center justify-center",
                        isCompleted
                            ? "bg-[#0481EF] text-primary-foreground"
                            : isActive
                                ? "border-primary bg-[#0481EF]"
                                : "border-muted",
                    )}
                >
                    {isCompleted ? <SvgCompleteStep /> : <span className={cn('text-[24px] text-black font-medium', isActive && 'text-white')}>{step}</span>}
                </div>
            </div>
            <div className="ml-4 flex-shrink-0">
                <p className={cn("text-[16px] font-medium", isActive || isCompleted ? "text-[#0481EF]" : "text-muted-foreground")}>
                    {title}
                </p>
                {description && <p className="text-[12px] text-muted-foreground">{description}</p>}
            </div>
        </div>
    )
}

interface StepperProps {
    steps: Array<{ title: string; description?: string }>
    currentStep: number
}

export function Stepper({ steps, currentStep }: StepperProps) {
    return (
        <div className="max-w-[100svw]  overflow-auto">
            <div className="flex w-max space-x-4 p-4">
                {steps.map((step, index) => (
                    <React.Fragment key={step.title}>
                        <Step
                            title={step.title}
                            description={step.description}
                            isCompleted={index < currentStep}
                            isActive={index === currentStep}
                            step={index + 1}
                        />
                        {index < steps.length - 1 && (
                            <div className="flex items-center flex-shrink-0">
                                <ChevronRight className="text-muted-foreground" />
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    )
}