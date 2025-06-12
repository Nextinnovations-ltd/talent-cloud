
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { LeftEllipse, RightEllipse } from "@/constants/svgs"


export const Card = React.memo(
    ({
        card,
        index,
        hovered,
        setHovered,
    }: {
        card: any;
        index: number;
        hovered: number | null;
        setHovered: React.Dispatch<React.SetStateAction<number | null>>;
    }) => (
        <div
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
            className={cn(
                "h-[127px]  overflow-hidden flex relative items-center justify-center rounded-[20px] gap-[31px] transition-all duration-300 ease-out",
                hovered !== null && hovered !== index && "blur-sm scale-[0.98]",
                index == 0 && 'bg-[#0389FF]',
                index == 1 && 'bg-[#1DA787]',
                index == 2 && 'bg-[#F59502]',
                index == 3 && 'bg-[#F57E9B]',
                index == 4 && 'bg-[#F87E56]',
                index == 5 && 'bg-[#C003FF]',

            )}
        >
            <div
                className={cn(
                    "absolute inset-0 bg-black/50 flex items-end py-8 px-4 transition-opacity duration-300",
                    hovered === index ? "opacity-100" : "opacity-0"
                )}
            >
            </div>

            <div className='flex flex-col items-start justify-center z-20 gap-[18px] text-white'>
                <h3 className='text-[24px]'>{card.title}</h3>
                <p className={cn('text-[16px] font-light')}>Years of Experience</p>
            </div>

            <div className='h-[38px] w-[1px] border-r border-white/20' />

            <div className='flex items-center justify-center  z-20 gap-[8px] text-[14px] text-white'>
                <h3 className={cn('text-[54px] font-semibold text-white/80', hovered === index && 'text-white')}>{card.year}</h3>
                <span  >/year</span>
            </div>

            <div className='absolute left-0 bottom-0 z-10'>
                <LeftEllipse color={card.ellipseColor} />
            </div>

            <div className='absolute right-0 top-0 z-10'>
                <RightEllipse color={card.ellipseColor} />
            </div>
        </div>
    )
);

Card.displayName = "Card";

type Card = {
    title: string;
    year: string;
    cardColor: string;
    ellipseColor: string
};

export function FocusCards({ cards }: { cards: Card[] }) {
    const [hovered, setHovered] = useState<number | null>(null);


    return (
        <div className='grid grid-cols-3 gap-[15px] mb-[70px]'>
            {cards.map((card, index) => (
                <Card
                    key={card.title}
                    card={card}
                    index={index}
                    hovered={hovered}
                    setHovered={setHovered}
                />
            ))}
        </div>
    );
}
