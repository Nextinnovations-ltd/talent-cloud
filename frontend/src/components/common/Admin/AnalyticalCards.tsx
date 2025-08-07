import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface AnalyticalCardsProps {
  title: string;
  count: number | undefined;
  loading: boolean;
}

const AnalyticalCards: React.FC<AnalyticalCardsProps> = ({ title, count, loading }) => {
  return (
    <div className="w-[50%] text-[#0481EF] h-[145px] px-[24px] py-[31px] border border-[#CBD5E1] rounded-[12px]">
      <h3>{title}</h3>
      {loading ? (
        <Skeleton className="h-[20px] mt-[16px] w-[100px]" />
      ) : (
        <p className="text-[32px] mt-[16px] font-bold">{count}</p>
      )}
    </div>
  );
};

export default AnalyticalCards;
