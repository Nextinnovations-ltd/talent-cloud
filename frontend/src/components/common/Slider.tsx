import { useState, useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import OFFICEONE from "@/assets/Employee/Rectangle 5668.png";
import OFFICETWO from "@/assets/Employee/Rectangle 5671.png";

type Slide = string | { src: string }; // handles both string URLs and objects with .src

interface SliderProps {
  images?: Slide[];
  visible?: number;     // how many cards visible at once
  intervalMs?: number;  // autoplay interval
}

const defaultImages: Slide[] = [OFFICEONE, OFFICETWO, OFFICEONE, OFFICETWO];

const getSrc = (img: Slide) =>
  typeof img === "string" ? img : (img as any).src ?? "";

const Slider = ({
  images = defaultImages,
  visible = 3,
  intervalMs = 5000,
}: SliderProps) => {
  const [current, setCurrent] = useState(0);
  const originalLen = images.length;
  const intervalRef = useRef<number | null>(null);

  // Extend the track so the last items can slide smoothly
  const trackImages =
    originalLen > visible ? images.concat(images.slice(0, visible)) : images;

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % (originalLen || 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + (originalLen || 1)) % (originalLen || 1));
  };

  // Auto-slide
  useEffect(() => {
    if (originalLen <= 1) return; // nothing to slide
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(nextSlide, intervalMs);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originalLen, intervalMs]);

  const percentPerCard = 100 / visible;

  return (
    <div className="mt-6 relative w-full flex items-center justify-center overflow-hidden">
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 hover:bg-gray-100 focus:outline-none"
        aria-label="Previous slide"
      >
        <FaChevronLeft size={20} />
      </button>

      <div
        className="flex w-full gap-4 h-[350px] transition-transform duration-700 ease-in-out"
        style={{
          // translate by one card each step
          transform: `translateX(-${current * percentPerCard}%)`,
          // width must match the *rendered* list length
          width: `${trackImages.length * percentPerCard}%`,
        }}
      >
        {trackImages.map((img, idx) => (
          <img
            key={idx}
            src={getSrc(img)}
            alt={`slide-${idx}`}
            className="rounded-lg h-[350px] w-1/3 object-cover shadow-lg flex-shrink-0"
            style={{ minWidth: `${percentPerCard}%` }}
          />
        ))}
      </div>

      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 hover:bg-gray-100 focus:outline-none"
        aria-label="Next slide"
      >
        <FaChevronRight size={20} />
      </button>
    </div>
  );
};

export default Slider;
