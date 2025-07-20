import { Link } from "react-router";
import { FaStar, FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { LuLogIn } from "react-icons/lu";

const LatestUserReviews = ({ reviews }) => {
    return (
        <section className="container mx-auto p-4">
            <h2 className="text-3xl font-bold mb-20">Latest User Reviews</h2>

            {reviews?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
                    {reviews.map((review) => (
                        <div key={review._id} className="relative group ">
                            {/* ✅ Overlapping user image */}
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10">
                                <img
                                    src={review.userImage}
                                    alt={review.userName}
                                    className="w-16 h-16 rounded-full border-4 border-white shadow-lg object-cover"
                                />
                            </div>
                            <div
                                className=" group p-6 bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden text-center"
                            >


                                {/* ✅ Card content */}
                                <div className=" pt-4 flex flex-col items-center gap-4">
                                    <div className="flex flex-col items-center ">
                                        <p className="font-bold">{review.userName} (Reviewer)</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(review.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    {/* Comment box */}
                                    <div className="relative bg-gray-100 rounded-lg p-4 text-gray-700">
                                        <FaQuoteLeft className="absolute top-2 left-2 text-orange-500 text-xl" />
                                        <p className="italic px-4">{review.comment}</p>
                                        <FaQuoteRight className="absolute bottom-2 right-2 text-orange-500 text-xl" />
                                    </div>

                                    {/* Star rating */}
                                    <div className="flex justify-center">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <FaStar
                                                key={star}
                                                className={`text-xl ${star <= review.rating ? "text-orange-500" : "text-gray-300"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-sm font-semibold text-center">
                                        Property:{" "}
                                        <span className="text-gray-600">{review.propertyTitle || "N/A"}</span>
                                    </p>

                                    {/* Optional details button on hover */}
                                    <div className="absolute inset-0 bg-black/60 flex items-center rounded-xl justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                                        <Link
                                            to={`/property/${review.propertyId}`}
                                            className="btn btn-primary"
                                        >
                                            View Property Details <LuLogIn />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center p-8">
                    <h2 className="text-2xl font-bold mb-4">No Reviews Yet!</h2>
                </div>
            )}
        </section>
    );
};

export default LatestUserReviews;
