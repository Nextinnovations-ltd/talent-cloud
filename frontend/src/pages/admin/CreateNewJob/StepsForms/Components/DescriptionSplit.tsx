import React from 'react'

type DescriptionSplitProps = {
    content: string;
}

const DescriptionSplit: React.FC<DescriptionSplitProps> = ({ content }) => {
    return (
        <div className="flex-grow mt-4">
            {/* <h3 className="text-[14px] line-clamp-3">{job.description}</h3> */}
            <h3 className="text-[14px] line-clamp-3">
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