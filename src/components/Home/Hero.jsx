import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { FaMapMarkerAlt, FaTags, FaPercent } from "react-icons/fa";
import { motion } from "framer-motion";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { NavLink } from "react-router";

export default function Hero() {
  return (
    <Carousel
      autoPlay
      infiniteLoop
      showThumbs={false}
      showStatus={false}
      emulateTouch
      useKeyboardArrows
      showIndicators
      renderArrowPrev={(clickHandler, hasPrev) =>
        hasPrev && (
          <button
            onClick={clickHandler}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 p-3 rounded-full text-white z-20"
          >
            <MdArrowBackIos size={20} />
          </button>
        )
      }
      renderArrowNext={(clickHandler, hasNext) =>
        hasNext && (
          <button
            onClick={clickHandler}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 p-3 rounded-full text-white z-20"
          >
            <MdArrowForwardIos size={20} />
          </button>
        )
      }
      renderIndicator={(onClickHandler, isSelected, index) => {
        const base = "inline-block w-3 h-3 rounded-full mx-1 cursor-pointer";
        const active = isSelected ? "bg-[#00BBA7] scale-110" : "bg-gray-400 hover:bg-[#00BBA7]";
        return (
          <span
            key={index}
            className={`${base} ${active}`}
            onClick={onClickHandler}
            aria-label={`Slide ${index + 1}`}
          />
        );
      }}
    >
      {/* === Slide 1 === */}
      <div
        className="relative flex items-center justify-center bg-cover bg-center text-white h-full lg:h-[80vh]"
        style={{
          backgroundImage:
            "url('https://i.ibb.co/MxTDW5My/new-buildings-with-green-areas.jpg')",
        }}
      >
        <div className="bg-black/60 w-full h-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="container py-20 md:py-10 mx-auto px-6 md:px-10 flex flex-col lg:flex-row items-center gap-10"
          >
            <div className="flex-1 space-y-5 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2 text-sm text-[#00BBA7]">
                <FaMapMarkerAlt />
                <span>Dhaka, Bangladesh</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight drop-shadow-md">
                Discover Your Perfect <br />
                <span className="text-[#00BBA7]">Luxury Apartment</span>
              </h2>
              <p className="text-base md:text-lg font-medium max-w-md mx-auto md:mx-0">
                Modern designs, spacious living, and world-class amenities for your premium lifestyle.
              </p>
              <p className="text-sm md:text-base font-semibold">Starting From</p>
              <p className="text-2xl md:text-3xl font-extrabold text-[#00BBA7]">
                $ 1,00,000
              </p>
            </div>

            <div className="flex-1 flex justify-center relative">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1 }}
                className="w-64 h-80 md:w-72 md:h-96 rounded-full border-4 border-[#00BBA7] overflow-hidden relative z-10 shadow-xl"
              >
                <img
                  src="https://i.ibb.co/MxTDW5My/new-buildings-with-green-areas.jpg"
                  alt="Luxury Apartments"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <div className="absolute top-4 right-4 bg-[#00BBA7] text-white text-xs md:text-sm px-4 py-2 rounded-full shadow-lg">
                Limited Offer
              </div>
              <div className="absolute bottom-8 left-0 bg-black text-white px-3 py-2 rounded-full flex items-center space-x-2 text-xs md:text-sm border border-[#00BBA7]">
                <FaTags className="text-[#00BBA7]" />
                <span>Exclusive Deals</span>
              </div>
              <div className="absolute bottom-8 right-0 bg-black text-white px-3 py-2 rounded-full flex items-center space-x-2 text-xs md:text-sm border border-[#00BBA7]">
                <FaPercent className="text-[#00BBA7]" />
                <span>Zero Brokerage Fee</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* === Slide 2 === */}
      <div className="h-full lg:h-[80vh] bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center">
        <div className="container py-20 md:py-10 mx-auto px-6 md:px-10 flex flex-col lg:flex-row items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="max-w-lg space-y-6"
          >
            <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
              Find Your <span className="text-[#00BBA7]">Dream Property</span>
            </h1>
            <p className="text-gray-300">
              Partner with us to access the best market insights, trusted agents, and secure investments for a brighter future.
            </p>
            <div className="flex sm:justify-center gap-4 mb-5 lg:mb-0">
              <NavLink to='/about-us'>
                <button className="bg-[#00BBA7] px-4 py-2 rounded shadow hover:opacity-90 transition duration-300">
                  Learn More
                </button>
              </NavLink>

              <NavLink to="/register">
                <button className="bg-[#00BBA7] px-4 py-2 rounded shadow hover:opacity-90 transition duration-300">
                  Join Now
                </button>
              </NavLink>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-10 md:mt-0 flex flex-col gap-6"
          >
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: i === 1 ? -20 : i === 2 ? 20 : 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 * i }}
                className="overflow-hidden rounded-full border-4 border-[#00BBA7] w-72 h-24 md:h-32 md:w-96 flex items-center justify-center shadow-lg"
              >
                <img
                  src={
                    i === 1
                      ? "https://i.ibb.co/HTwy6Z9Z/14735.jpg"
                      : i === 2
                        ? "https://i.ibb.co/X9b8qdg/14696.jpg"
                        : "https://i.ibb.co/39QtwC9z/download.jpg"
                  }
                  alt={`building${i}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* === Slide 3 === */}
      <div className="h-full lg:h-[80vh] flex items-center font-sans justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://i.ibb.co/ZRBsDKcZ/analog-landscape-city-with-buildings.jpg')",
        }}
      >
        <div className="container py-20 md:py-10 mx-auto px-6 md:px-10 flex flex-col lg:flex-row items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-12 py-10 bg-[#00BBA7] text-white relative overflow-hidden"
          >
            <div className="relative z-10 text-center md:text-left">
              <p className="text-sm tracking-widest uppercase">Limited Time</p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold my-4 leading-tight drop-shadow-lg">
                Live <span className="text-black">Closer To Nature</span>
              </h1>
              <p className="text-black text-opacity-80 max-w-md mx-auto md:mx-0 mb-6">
                Discover eco-friendly communities surrounded by lush greenery, clean air, and peaceful living — the perfect blend of modern comfort and nature.
              </p>
              <NavLink to='/all-properties'>
                <button className="bg-white text-black px-6 py-2 rounded shadow hover:bg-black hover:text-white transition-all">
                  Explore Now
                </button>
              </NavLink>
            </div>
          </motion.div>

          <div className="w-full md:w-1/2 h-full">
            <img
              src="https://i.ibb.co/ZRBsDKcZ/analog-landscape-city-with-buildings.jpg"
              alt="Eco Home"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </Carousel>
  );
}
