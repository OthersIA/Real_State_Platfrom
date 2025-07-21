import React, { useState } from "react";
import {
  FaUserPlus,
  FaSearch,
  FaComments,
  FaHandshake,
  FaCheckDouble,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

const steps = [
  {
    id: 1,
    title: "Sign Up",
    description: "Create your account in seconds.",
    icon: <FaUserPlus className="text-3xl mb-2 text-[#00BBA7] mx-auto" />,
  },
  {
    id: 2,
    title: "Browse Listings",
    description: "Find your perfect match.",
    icon: <FaSearch className="text-3xl mb-2 text-[#00BBA7] mx-auto" />,
  },
  {
    id: 3,
    title: "Connect",
    description: "Contact agents or sellers directly.",
    icon: <FaComments className="text-3xl mb-2 text-[#00BBA7] mx-auto" />,
  },
  {
    id: 4,
    title: "Make an Offer",
    description: "Submit offers securely.",
    icon: <FaHandshake className="text-3xl mb-2 text-[#00BBA7] mx-auto" />,
  },
  {
    id: 5,
    title: "Close Deal",
    description: "Complete your purchase with ease.",
    icon: <FaCheckDouble className="text-3xl mb-2 text-[#00BBA7] mx-auto" />,
  },
];

const HowItWorksCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % steps.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + steps.length) % steps.length);
  };

  return (
    <section className=" bg-base-100">
      <div className="container mx-auto py-16 px-4 md:px-10 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[#00BBA7] mb-2">
          How It Works
        </h2>
        <p className=" max-w-xl mx-auto mb-10">
          Follow these simple steps to find your perfect property and close the deal with confidence.
        </p>

        <div className="flex justify-center items-center gap-4 mb-8">
          <button
            onClick={handlePrev}
            className="btn btn-outline hover:bg-[#00BBA7] hover:text-white btn-sm rounded-full"
          >
            <FaArrowLeft />
          </button>

          <div className="flex gap-4 items-end transition-all">
            {/* Previous Card */}
            <div
              className="w-[280px] h-[180px] transition-all duration-500 p-6 rounded-lg border shadow-md bg-base-300 opacity-40 scale-90"
            >
              <div>{steps[(activeIndex - 1 + steps.length) % steps.length].icon}</div>
              <h3 className="text-lg font-semibold text-[#00BBA7]">
                {steps[(activeIndex - 1 + steps.length) % steps.length].title}
              </h3>
              <p className=" text-xl">
                {steps[(activeIndex - 1 + steps.length) % steps.length].description}
              </p>
            </div>

            {/* Active Card */}
            <div className="w-[320px] h-[180px] transition-all duration-500 p-6 rounded-lg border shadow-lg bg-base-300 opacity-100 scale-100">
              <div>{steps[activeIndex].icon}</div>
              <h3 className="text-xl font-bold text-[#00BBA7]">
                {steps[activeIndex].title}
              </h3>
              <p className=" text-xl">
                {steps[activeIndex].description}
              </p>
            </div>

            {/* Next Card */}
            <div
              className="w-[280px] h-[180px] transition-all duration-500 p-6 rounded-lg border shadow-md bg-base-300 opacity-40 scale-90"
            >
              <div>{steps[(activeIndex + 1) % steps.length].icon}</div>
              <h3 className="text-lg font-semibold text-[#00BBA7]">
                {steps[(activeIndex + 1) % steps.length].title}
              </h3>
              <p className=" text-xl">
                {steps[(activeIndex + 1) % steps.length].description}
              </p>
            </div>
          </div>

          <button
            onClick={handleNext}
            className="btn btn-outline hover:bg-[#00BBA7] hover:text-white btn-sm rounded-full"
          >
            <FaArrowRight />
          </button>
        </div>

        {/* Pagination dots */}
        <div className="flex items-center justify-center gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${index === activeIndex ? "bg-[#00BBA7]" : "bg-gray-300"
                }`}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksCarousel;
