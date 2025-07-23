import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import { NavLink } from 'react-router';

import bannerImage1 from "../../assets/banners/banner2.png";
import bannerImage2 from "../../assets/banners/banner3.png";
import bannerImage3 from "../../assets/banners/banner1.png";

const Banner = () => {
    return (
        <div className="container mx-auto mt-4 md:mt-8 relative overflow-hidden rounded-lg shadow-sm">
            <Carousel
                autoPlay={true}
                infiniteLoop={true}
                showThumbs={false}
                showStatus={false}
                showArrows={true}
                showIndicators={true}
                interval={4000}
                transitionTime={500}
                stopOnHover={true}
                className="carousel carousel-center w-full"
                renderArrowPrev={(onClickHandler, hasPrev, label) =>
                    hasPrev && (
                        <button
                            type="button"
                            onClick={onClickHandler}
                            title={label}
                            className="absolute top-1/2 left-4 z-10 p-2 transform -translate-y-1/2 btn btn-circle btn-primary shadow-lg hover:scale-105 transition-transform"
                        >
                            ❮
                        </button>
                    )
                }
                renderArrowNext={(onClickHandler, hasNext, label) =>
                    hasNext && (
                        <button
                            type="button"
                            onClick={onClickHandler}
                            title={label}
                            className="absolute top-1/2 right-4 z-10 p-2 transform -translate-y-1/2 btn btn-circle btn-primary shadow-lg hover:scale-105 transition-transform"
                        >
                            ❯
                        </button>
                    )
                }
                renderIndicator={(onClickHandler, isSelected, index, label) => {
                    if (isSelected) {
                        return (
                            <li
                                className="indicator-dot w-3 h-3 bg-primary rounded-full mx-1 cursor-pointer transition-all duration-300 transform scale-125"
                                aria-label={`Selected: ${label} ${index + 1}`}
                                tabIndex={0}
                                onClick={onClickHandler}
                                onKeyDown={onClickHandler}
                                value={index}
                                role="button"
                            />
                        );
                    }
                    return (
                        <li
                            className="indicator-dot w-2 h-2 bg-gray-400 rounded-full mx-1 cursor-pointer transition-all duration-300 hover:bg-gray-600"
                            aria-label={`${label} ${index + 1}`}
                            tabIndex={0}
                            onClick={onClickHandler}
                            onKeyDown={onClickHandler}
                            value={index}
                            role="button"
                        />
                    );
                }}
            >
                {/* Slide 1 */}
                <div className="carousel-item relative w-full">
                    <img
                        src={bannerImage1}
                        alt="Banner 1"
                        className="w-full object-cover rounded-lg aspect-video sm:aspect-[4/3] md:aspect-video h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[500px]"
                    />
                    {/* Legend and Button Container - Aligned to start (left) */}
                    <div className="absolute inset-0 flex flex-col justify-end items-end pb-2">
                        <NavLink to="/all-properties" className="block">
                            {/* THIS IS THE BUTTON WITH YOUR NEW STYLES */}
                            <button className="bg-[#00BFB2] bg-opacity-60 text-white px-3 py-2 md:px-4 md:py-2 rounded-l-lg text-right text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 hover:bg-opacity-80 cursor-pointer">
                                Shop Now!
                            </button>
                        </NavLink>
                    </div>
                </div>

                {/* Slide 2 */}
                <div className="carousel-item relative w-full">
                    <img
                        src={bannerImage2}
                        alt="Banner 2"
                        className="w-full object-cover rounded-lg aspect-video sm:aspect-[4/3] md:aspect-video h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[500px]"
                    />
                    <div className="absolute inset-0 flex flex-col justify-end items-start pb-2">
                        <NavLink to="/all-properties" className="block">
                            {/* THIS IS THE BUTTON WITH YOUR NEW STYLES */}
                            <button className="bg-[#00BBA7] bg-opacity-60 text-white px-3 py-2 md:px-4 md:py-2 rounded-r-lg text-right text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 hover:bg-opacity-80 cursor-pointer">
                                View Deals
                            </button>
                        </NavLink>
                    </div>
                </div>

                {/* Slide 3 */}
                <div className="carousel-item relative w-full">
                    <img
                        src={bannerImage3}
                        alt="Banner 3"
                        className="w-full object-cover rounded-lg aspect-video sm:aspect-[4/3] md:aspect-video h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[500px]"
                    />
                    <div className="absolute inset-0 flex flex-col justify-end items-end pb-2">
                        <NavLink to="/all-properties" className="block">
                            {/* THIS IS THE BUTTON WITH YOUR NEW STYLES */}
                            <button className="bg-[#00BBA7] bg-opacity-60 text-white px-3 py-2 md:px-4 md:py-2 rounded-l-lg text-right text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 hover:bg-opacity-80 cursor-pointer">
                                Explore
                            </button>
                        </NavLink>
                    </div>
                </div>
            </Carousel>
        </div>
    );
};

export default Banner;