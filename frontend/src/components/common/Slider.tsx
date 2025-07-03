import { useState, useEffect, useRef } from "react";

interface SliderProps {
  images?: string[];
}

const defaultImages = [
  "https://en.idei.club/uploads/posts/2023-03/1679223637_en-idei-club-p-office-background-image-dizain-krasivo-1.jpg",
  "https://img.freepik.com/free-photo/online-school-equipment-home_23-2149041150.jpg?semt=ais_hybrid&w=740",
  "https://images.pexels.com/photos/1024248/pexels-photo-1024248.jpeg?cs=srgb&dl=pexels-janetrangdoan-1024248.jpg&fm=jpg"
];

const Slider = ({ images = defaultImages }: SliderProps) => {
  const [current, setCurrent] = useState(0);
  const length = images.length;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + length) % length);
  };

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % length);
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [length]);

  // For smooth sliding animation
  const sliderRef = useRef<HTMLDivElement>(null);

  return (
    <div className="mt-6 relative w-full flex items-center justify-center overflow-hidden">
      <button onClick={prevSlide} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 hover:bg-gray-100 focus:outline-none">
        <FaChevronLeft size={20} />
      </button>
      <div
        ref={sliderRef}
        className="flex w-full gap-4 h-[350px] transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${current * (100 / 3)}%)`,
          width: `${images.length * (100 / 3)}%`,
        }}
      >
        {images.concat(images.slice(0, 3)).map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`slide-${idx}`}
            className="rounded-lg h-[350px] w-1/3 object-cover shadow-lg flex-shrink-0"
            style={{ minWidth: '33.3333%' }}
          />
        ))}
      </div>
      <button onClick={nextSlide} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 hover:bg-gray-100 focus:outline-none">
        <FaChevronRight size={20} />
      </button>
    </div>
  );
};

export default Slider;
