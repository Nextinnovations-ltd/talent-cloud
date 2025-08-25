import clsx from 'clsx';
import React from 'react'

type DescriptionSplitProps = {
    content: string;
    isline?: boolean;
}

const DescriptionSplit: React.FC<DescriptionSplitProps> = ({ content,isline = true }) => {
    return (
        <div className="flex-grow mt-4">
            {/* <h3 className="text-[14px] line-clamp-3">{job.description}</h3> */}
            <h3 className={clsx('text-[14px] ', isline && "line-clamp-3")}>
                {content?.split('/n').map((item, index) => (
                    <li className="" key={index}>
                        {item}
                    </li>
                ))}
            </h3>
        </div>
    )
}

export default DescriptionSplit;