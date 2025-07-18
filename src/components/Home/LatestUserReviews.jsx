import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingFallback from "../shared/LoadingFallback";
import { Link } from "react-router";
import { FaStar } from "react-icons/fa";

const LatestUserReviews = () => {
    const { data: reviews = [], isLoading } = useQuery({
        queryKey: ["latestReviews"],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/all-reviews`);
            return res.data
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 3);
        },
    });

    if (isLoading) return <LoadingFallback />;

    if (reviews.length === 0) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold mb-4">No Reviews Yet!</h2>
            </div>
        );
    }

    return (
        <section className="container mx-auto p-4">
            <h2 className="text-3xl font-bold mb-6">Latest User Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {reviews.map((review) => (
                    <div
                        key={review._id}
                        className="p-4 border rounded shadow-sm hover:shadow-lg transition flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center gap-4 mb-3">
                                <img
                                    src={review.userImage}
                                    alt={review.userName}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                    <p className="font-bold">{review.userName}</p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(review.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <p className="mb-2 ">{review.comment}</p>

                            {/* ✅ Rating */}
                            <div className="flex items-center mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        className={star <= review.rating ? "text-yellow-500" : "text-gray-300"}
                                    >
                                        <FaStar />
                                    </span>
                                ))}
                            </div>

                            <p className="text-sm font-semibold mb-3">
                                Property: <span className=" text-primary">{review.propertyTitle || "N/A"}</span>
                            </p>
                        </div>

                        {/* ✅ Details Button */}
                        <Link
                            to={`/property/${review.propertyId}`}
                            className="btn btn-primary btn-sm w-full"
                        >
                            View Property Details
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default LatestUserReviews;