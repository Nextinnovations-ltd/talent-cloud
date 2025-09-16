import React from 'react';

interface HtmlContentProps {
  title?: string;
  content?: string; // HTML string from editor
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  maxLines?: number; // optional line clamp
}

const HtmlContent: React.FC<HtmlContentProps> = ({
  title,
  content = "",
  className = "",
  titleClassName = "text-[24px] font-bold mb-4 mt-6",
  contentClassName = "text-[#635F5F] space-y-2",
  maxLines,
}) => {
  const clampStyle = maxLines
    ? {
        display: '-webkit-box',
        WebkitLineClamp: maxLines,
        WebkitBoxOrient: 'vertical' as const,
        overflow: 'hidden',
      }
    : {};

  return (
    <div className={className}>
      {title && <h3 className={titleClassName}>{title}</h3>}

      <div
        className={`${contentClassName} 
          [&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg [&_h4]:text-base 
          [&_h1]:font-bold [&_h2]:font-semibold [&_h3]:font-semibold [&_h4]:font-semibold 
          [&_h1]:text-black [&_h2]:text-black [&_h3]:text-black [&_h4]:text-black
          [&_li]:mb-1 [&_p]:mb-2`}
        style={clampStyle}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default HtmlContent;
