import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import { Link } from "react-router";
import { FaStar, FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { LuLogIn } from "react-icons/lu";

const LatestUserReviews = ({ reviews }) => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <section className="container mx-auto p-4 my-6">
      <h2
        className="text-3xl text-center font-bold border-b-2 pb-2 mb-20 text-[#00BBA7]"
        style={{ boxShadow: "0 4px 4px -2px rgba(0, 0, 0, 0.25)" }}
      >
        Latest User Reviews
      </h2>


      {reviews?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div
              key={review._id}
              className="relative"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              {/* User image */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10">
                <img
                  src={review.userImage}
                  alt={review.userName}
                  className="w-16 h-16 rounded-full border-4 border-base-100 shadow-lg object-cover"
                />
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

                {/* Always visible button */}
                {/* <div className="mt-6">
                  <Link
                    to={`/property/${review.propertyId}`}
                    className="btn w-full bg-[#00BBA7] text-white border-none"
                  >
                    View Property Details <LuLogIn />
                  </Link>
                </div> */}
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
    </section>
  );
};

export default LatestUserReviews;
