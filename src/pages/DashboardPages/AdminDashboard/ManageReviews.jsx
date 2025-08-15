import { useEffect, useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import LoadingFallback from "../../../components/shared/LoadingFallback";
import { Link } from "react-router";
import { FaQuoteLeft, FaQuoteRight, FaStar, FaUserCircle } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import { Helmet } from "react-helmet-async";

const ManageReviews = () => {
    const queryClient = useQueryClient();

    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 6;

    useEffect(() => {
        AOS.init({ duration: 800, easing: "ease-in-out", once: true });
    }, []);

    const { data: reviews = [], isLoading } = useQuery({
        queryKey: ["all-reviews"],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/all-reviews`);
            return res.data;
        },
    });

    const deleteReview = useMutation({
        mutationFn: async (id) => {
            await axios.delete(`${import.meta.env.VITE_API_URL}/reviews/${id}`);
        },
        onSuccess: () => {
            Swal.fire("Deleted!", "The review has been removed.", "success");
            queryClient.invalidateQueries(["all-reviews"]);
        },
        onError: () => {
            Swal.fire("Error", "Failed to delete the review.", "error");
        },
    });

    if (isLoading) return <LoadingFallback />;

    // Calculate pagination
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);

    const currentReviews = useMemo(() => {
        const startIndex = (currentPage - 1) * reviewsPerPage;
        return reviews.slice(startIndex, startIndex + reviewsPerPage);
    }, [reviews, currentPage]);

    return (
        <section className="container mx-auto px-4 py-8" data-aos="fade-up">
            <Helmet>
                <title>Manage Reviews | RealEstate</title>
            </Helmet>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#00BBA7]">
                Manage Reviews
            </h2>

            {reviews.length === 0 ? (
                <p className="text-gray-500">No reviews yet.</p>
            ) : (
                <>
                    {/* Reviews Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentReviews.map((review) => (
                            <div
                                key={review._id}
                                data-aos="fade-up"
                                className="border p-5 rounded-xl shadow-sm bg-base-100 hover:shadow-md transition"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    {review.userImage ? (
                                        <img
                                            src={review.userImage}
                                            alt="Reviewer"
                                            className="w-10 h-10 rounded-full object-cover ring ring-[#00BBA7] ring-offset-2"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                                            <FaUserCircle className="w-6 h-6" />
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-semibold">
                                            {review.userName || "Unknown"}
                                        </p>
                                        <p className="text-xs text-gray-500">{review.userEmail}</p>
                                    </div>
                                </div>

                                <div className="relative bg-base-200 rounded-lg p-4 text-base-content">
                                    <FaQuoteLeft className="absolute top-2 left-2 text-[#00BBA7] text-xl" />
                                    <p className="italic px-4">{review.comment}</p>
                                    <FaQuoteRight className="absolute bottom-2 right-2 text-[#00BBA7] text-xl" />
                                </div>

                                <div className="flex items-center gap-1 mb-2 mt-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={star}
                                            className={
                                                star <= (review.rating || 0)
                                                    ? "text-yellow-500"
                                                    : "text-gray-300"
                                            }
                                        >
                                            <FaStar />
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-3 mt-4">
                                    <Link
                                        to={`/property/${review.propertyId}`}
                                        className="btn btn-xs border border-[#00BBA7] text-[#00BBA7] hover:bg-[#00BBA7] hover:text-white transition"
                                    >
                                        View Property
                                    </Link>

                                    <button
                                        onClick={() =>
                                            Swal.fire({
                                                title: "Delete?",
                                                text: "This review will be removed permanently.",
                                                icon: "warning",
                                                showCancelButton: true,
                                                confirmButtonText: "Yes, delete it!",
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    deleteReview.mutate(review._id);
                                                }
                                            })
                                        }
                                        className="btn btn-xs border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-8 gap-2">
                            <button
                                className="btn btn-sm"
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Prev
                            </button>
                            {[...Array(totalPages)].map((_, idx) => (
                                <button
                                    key={idx}
                                    className={`btn btn-sm ${currentPage === idx + 1
                                            ? "bg-[#00BBA7] text-white"
                                            : "btn-outline"
                                        }`}
                                    onClick={() => setCurrentPage(idx + 1)}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                            <button
                                className="btn btn-sm"
                                onClick={() =>
                                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                                }
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
};

export default ManageReviews;
