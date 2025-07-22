import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import { Link } from "react-router";
import { FaStar, FaQuoteLeft, FaQuoteRight, FaUserCircle } from "react-icons/fa";

const LatestUserReviews = ({ reviews }) => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <section className="bg-base-200">
      <div className="container mx-auto p-4 py-12">
        <h2
          className="text-3xl md:text-4xl text-center font-bold mb-4 text-[#00BBA7]"
          data-aos="fade-down"
          data-aos-delay="100"
        >
          Latest User Reviews
        </h2>

        <p
          className="text-center max-w-2xl mx-auto mb-12"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          Hear what our satisfied users are saying! Real feedback from real buyers and sellers helps you make informed choices and trust us for your next property deal.
        </p>

        {reviews?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <div
                key={review._id}
                className="relative"
                data-aos="fade-up"
                data-aos-delay={300 + index * 100}
              >
                {/* User image */}
                <div className=" w-16 h-16 absolute -top-8 left-1/2 transform -translate-x-1/2 z-10">
                  {review.userImage ? (
                    <img
                      src={review.userImage}
                      alt={review.userName}
                      className="w-full h-full rounded-full border-4 border-base-100 shadow-lg object-cover"
                    />
                  ) : (
                    <FaUserCircle className="w-full h-full text-[#00BBA7]" />
                  )}
                </div>


                {/* Card */}
                <div className="p-6 rounded-xl shadow-md overflow-hidden text-center border border-base-200 bg-base-300 flex flex-col justify-between">
                  <div className="pt-8 flex flex-col items-center gap-4 flex-grow">
                    <div className="flex flex-col items-center">
                      <p className="font-bold text-[#00BBA7]">
                        {review.userName} (Reviewer)
                      </p>
                      <p className="text-sm text-base-content opacity-60">
                        {new Date(review.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="relative bg-base-200 rounded-lg p-4 text-base-content">
                      <FaQuoteLeft className="absolute top-2 left-2 text-[#00BBA7] text-xl" />
                      <p className="italic px-4">{review.comment}</p>
                      <FaQuoteRight className="absolute bottom-2 right-2 text-[#00BBA7] text-xl" />
                    </div>

                    <div className="flex justify-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`text-xl ${star <= review.rating
                            ? "text-[#00BBA7]"
                            : "text-base-content opacity-30"
                            }`}
                        />
                      ))}
                    </div>

                    <p className="text-sm font-semibold text-center">
                      Property:{" "}
                      <span className="text-base-content opacity-70">
                        {review.propertyTitle || "N/A"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4 text-[#00BBA7]">
              No Reviews Yet!
            </h2>
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestUserReviews;
