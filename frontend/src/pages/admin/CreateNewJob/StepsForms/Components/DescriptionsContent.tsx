import React from 'react';

interface DescriptionsContentProps {
  title?: string;
  content?: string;
  className?: string;
  titleClassName?: string;
  listClassName?: string;
  itemClassName?: string;
  delimiter?: string;
}

const DescriptionsContent: React.FC<DescriptionsContentProps> = ({
  title = "What we offer?",
  content = "",
  className = "",
  titleClassName = "text-[20px] font-semibold mb-[16px] mt-[32px]",
  listClassName = "list-disc  pl-5",
  itemClassName = "text-[#635F5F]",
  delimiter = "/n"
}) => {
  if (!content) return null;

  return (
    <div className={className}>
      <h3 className={titleClassName}>{title}</h3>
      <ul className={listClassName}>
        {content.split(delimiter).map((item, index) => (
          <li className={itemClassName} key={index}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DescriptionsContent;