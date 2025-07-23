import React from 'react'

interface AnalyticalCardsProps {
  title: string;
  count: number;
}

const AnalyticalCards: React.FC<AnalyticalCardsProps> = ({ title, count }) => {
  return (
    <div className="w-[50%] text-[#0481EF] px-[24px] py-[21px] border border-[#CBD5E1] rounded-[12px]">
      <h3>{title}</h3>
      <p className="text-[32px] mt-[16px] font-bold">{count}</p>
    </div>
  )
}

export default AnalyticalCards;