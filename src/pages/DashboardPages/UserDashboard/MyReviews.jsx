import { useContext, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router";
import { AuthContext } from "../../../context/AuthContext";
import LoadingFallback from "../../../components/shared/LoadingFallback";
import { FaQuoteLeft, FaQuoteRight, FaStar } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const MyReviews = () => {
    const { user } = useContext(AuthContext);
    const queryClient = useQueryClient();

    useEffect(() => {
        AOS.init({ duration: 600, easing: "ease-out" });
    }, []);

    // Fetch all reviews by logged-in user
    const { data: reviews = [], isLoading } = useQuery({
        queryKey: ["my-reviews", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/reviews?email=${user.email}`
            );
            return res.data;
        },
    });

    // Delete mutation
    const deleteReview = useMutation({
        mutationFn: async (id) => {
            await axios.delete(`${import.meta.env.VITE_API_URL}/reviews/${id}`);
        },
        onSuccess: () => {
            Swal.fire("Deleted!", "Your review has been deleted.", "success");
            queryClient.invalidateQueries(["my-reviews"]);
        },
        onError: () => {
            Swal.fire("Error", "Failed to delete the review.", "error");
        },
    });

    if (isLoading) return <LoadingFallback />;

    return (
        <section className="container mx-auto px-4 py-8" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#00BBA7]">My Reviews</h2>

            {reviews.length === 0 ? (
                <p>You haven’t added any reviews yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.map((review) => (
                        <div
                            key={review._id}
                            data-aos="fade-up"
                            className="p-4 rounded shadow-sm bg-base-300 border border-[#00BBA7]"
                        >
                            <div className="flex items-center gap-4 mb-3">
                                <img
                                    src={review.agentImage}
                                    alt={review.agentName}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-[#00BBA7]"
                                />
                                <div>
                                    <p className="font-bold text-[#00BBA7]">{review.agentName} (Agent)</p>
                                    <p className="text-sm text-gray-600">
                                        {new Date(review.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="relative bg-base-200 rounded-lg p-4 text-base-content">
                                <FaQuoteLeft className="absolute top-2 left-2 text-[#00BBA7] text-xl" />
                                <p className="italic px-4">{review.comment}</p>
                                <FaQuoteRight className="absolute bottom-2 right-2 text-[#00BBA7] text-xl" />
                            </div>
                            <div className="flex items-center gap-1 mt-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        className={
                                            star <= (review.rating || 0)
                                                ? "text-[#00BBA7]"
                                                : "text-gray-300"
                                        }
                                    >
                                        <FaStar />
                                    </span>
                                ))}
                            </div>
                            <p className="text-sm font-semibold mb-3">
                                Property:{" "}
                                <span className="text-[#00BBA7] cursor-pointer hover:underline">
                                    {review.propertyTitle || "N/A"}
                                </span>
                            </p>

                            <div className="flex gap-2 mt-3">
                                <Link
                                    to={`/property/${review.propertyId}`}
                                    className="btn btn-xs border border-[#00BBA7] text-[#00BBA7] hover:bg-[#00BBA7] hover:text-white"
                                >
                                    Details
                                </Link>

                                <button
                                    onClick={() =>
                                        Swal.fire({
                                            title: "Delete?",
                                            text: "This review will be permanently removed.",
                                            icon: "warning",
                                            showCancelButton: true,
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                deleteReview.mutate(review._id);
                                            }
                                        })
                                    }
                                    className="btn btn-xs btn-error"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default MyReviews;
