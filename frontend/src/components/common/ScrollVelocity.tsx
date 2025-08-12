import React, { useRef, useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";
import "./ScrollVelocity.css";

interface MarqueeTextProps {
  children: React.ReactNode;
  speed?: number; // pixels per second
  numCopies?: number;
  className?: string;
  parallaxClassName?: string;
  scrollerClassName?: string;
  parallaxStyle?: React.CSSProperties;
  scrollerStyle?: React.CSSProperties;
}

interface ScrollVelocityProps {
  texts: string[];
  speed?: number; // pixels per second
  className?: string;
  numCopies?: number;
  parallaxClassName?: string;
  scrollerClassName?: string;
  parallaxStyle?: React.CSSProperties;
  scrollerStyle?: React.CSSProperties;
}

function useElementWidth(ref: React.RefObject<HTMLElement>): number {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    function updateWidth() {
      if (ref.current) {
        setWidth(ref.current.offsetWidth);
      }
    }
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [ref]);

  return width;
}

const MarqueeText: React.FC<MarqueeTextProps> = ({
  children,
  speed = 100, // pixels per second
  numCopies = 6,
  className = "",
  parallaxClassName = "parallax",
  scrollerClassName = "scroller",
  parallaxStyle,
  scrollerStyle,
}) => {
  const copyRef = useRef<HTMLSpanElement>(null);
  const copyWidth = useElementWidth(copyRef);

  // Calculate animation duration based on width and speed
  const duration = copyWidth > 0 ? (copyWidth * numCopies) / speed : 10;

  const spans = [];
  for (let i = 0; i < numCopies; i++) {
    spans.push(
      <span className={className} key={i} ref={i === 0 ? copyRef : null}>
        {children}
      </span>
    );
  }

  return (
    <div className={parallaxClassName} style={parallaxStyle}>
      <motion.div
        className={scrollerClassName}
        style={{ ...scrollerStyle }}
        animate={{ x: copyWidth ? [-0, -copyWidth] : [0, 0] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: duration,
        }}
      >
        {spans}
      </motion.div>
    </div>
  );
};

export const ScrollVelocity: React.FC<ScrollVelocityProps> = ({
  texts = [],
  speed = 100,
  className = "",
  numCopies = 6,
  parallaxClassName = "parallax",
  scrollerClassName = "scroller",
  parallaxStyle,
  scrollerStyle,
}) => {
  return (
    <section>
      {texts.map((text: string, index: number) => (
        <MarqueeText
          key={index}
          className={className}
          speed={speed}
          numCopies={numCopies}
          parallaxClassName={parallaxClassName}
          scrollerClassName={scrollerClassName}
          parallaxStyle={parallaxStyle}
          scrollerStyle={scrollerStyle}
        >
          {text}&nbsp;
        </MarqueeText>
      ))}
    </section>
  );
};

export default ScrollVelocity;
