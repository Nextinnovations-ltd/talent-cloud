import React from 'react'

interface EmptyDataProps {
  image: React.ReactNode;
  title: string;
  description: string;
}

export const EmptyData = ({ image, title, description }: EmptyDataProps) => {
  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 143, position: 'relative' }}>
      {image}
      <div className="h-[220px] w-[500px] absolute bg-white drop-shadow-md flex items-center justify-center flex-col rounded-xl gap-[30px]">
        <h3 className="text-[26px] font-bold">{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  )
}
