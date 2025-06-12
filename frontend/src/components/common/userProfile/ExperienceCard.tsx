import { LeftEllipse, RightEllipse } from "@/constants/svgs"
import clsx from "clsx"
import "./ExperienceCard.css"
interface ExperienceCardProps {
    title: string;
    year: string;
    ellipseColor: string;
    cardColor: string;
}

export const ExperienceCard = ({
    title,
    year,
    ellipseColor,
    cardColor,
}: ExperienceCardProps) => {
    return (
        <div
            className={clsx(
                'h-[127px] duration-500 overflow-hidden flex relative items-center justify-center rounded-[20px] gap-[31px]',
                `bg-${cardColor}`
            )}
            style={{ backgroundColor: cardColor }}
        >
            <div className='flex flex-col items-start justify-center z-20 gap-[18px] text-white'>
                <h3 className='text-[24px]'>{title}</h3>
                <p className='text-[16px] font-light'>Years of Experience</p>
            </div>

            <div className='h-[38px] w-[1px] border-r border-white/20' />

            <div className='flex items-center justify-center gap-[8px] text-[14px] text-white'>
                <h3 className='text-[54px] font-semibold text-white/80'>{year}</h3>
                <span>/year</span>
            </div>

            <div className='absolute left-0 bottom-0 z-10'>
                <LeftEllipse color={ellipseColor} />
            </div>

            <div className='absolute right-0 top-0 z-10'>
                <RightEllipse color={ellipseColor} />
            </div>
        </div>
    )
}