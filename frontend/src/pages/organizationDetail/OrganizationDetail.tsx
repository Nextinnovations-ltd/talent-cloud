import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { ComponentProps } from "react";

const OrganizationDetail = () => {
  const images = [
    "https://en.idei.club/uploads/posts/2023-03/1679223637_en-idei-club-p-office-background-image-dizain-krasivo-1.jpg",
    "https://img.freepik.com/free-photo/online-school-equipment-home_23-2149041150.jpg?semt=ais_hybrid&w=740",
    "https://images.pexels.com/photos/1024248/pexels-photo-1024248.jpeg?cs=srgb&dl=pexels-janetrangdoan-1024248.jpg&fm=jpg"
  ];

  const ArrowLeft = (props: ComponentProps<"button">) => (
    <button {...props} className="absolute z-10 left-2 top-1/2 -translate-y-1/2 bg-white rounded-full shadow p-2 hover:bg-gray-100 focus:outline-none">
      <FaChevronLeft size={20} />
    </button>
  );
  const ArrowRight = (props: ComponentProps<"button">) => (
    <button {...props} className="absolute z-10 right-2 top-1/2 -translate-y-1/2 bg-white rounded-full shadow p-2 hover:bg-gray-100 focus:outline-none">
      <FaChevronRight size={20} />
    </button>
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "linear",
    nextArrow: <ArrowRight />,
    prevArrow: <ArrowLeft />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <>
      <div 
        className="w-full pt-[200px] h-[400px] bg-[url('https://en.idei.club/uploads/posts/2023-03/1679223637_en-idei-club-p-office-background-image-dizain-krasivo-1.jpg')] bg-cover bg-center"
      >
        <div className="bg-white container rounded-lg mx-auto w-full drop-shadow-md h-[400px] "></div>
      </div>
      <div className="mt-[280px] container rounded-lg mx-auto">
        <div>
          <h3 className="text-[26px] font-semibold">About Company</h3>
          <p className="mt-[20px] text-[#6B6B6B] text-[18px]">We are web development and digital marketing company. Our technology and knowledge are Japan. we can think about your success of the your business.please contact us if you want to get success of the business. 【 Our products】 -Web design ( UI/UX design) -Web development (including web system) -Digital Marketing (Facebook, Instagram, YouTube etc) -video editing.</p>
        </div>
        <div className="mt-[50px]">
          <h3 className="text-[26px] font-semibold">Our working environments</h3>
          <div className="mt-6">
            <Slider {...settings}>
              {images.map((img, idx) => (
                <div key={idx} className="px-2">
                  <img src={img} alt={`slide-${idx}`} className="rounded-lg w-full h-[350px] object-cover shadow-lg transition-transform duration-500" />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrganizationDetail