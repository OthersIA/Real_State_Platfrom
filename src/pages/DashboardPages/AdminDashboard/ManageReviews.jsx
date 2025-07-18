import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import LoadingFallback from "../../../components/shared/LoadingFallback";
import { Link } from "react-router";
import { FaStar, FaUserCircle } from "react-icons/fa";

const ManageReviews = () => {
    const queryClient = useQueryClient();

    // ✅ Load all reviews
    const { data: reviews = [], isLoading } = useQuery({
        queryKey: ["all-reviews"],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/all-reviews`);
            return res.data;
        },
    });

    // ✅ Delete review mutation
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

    return (
        <section className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Manage Reviews</h2>

            {reviews.length === 0 ? (
                <p>No reviews yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reviews.map((review) => (
                        <div
                            key={review._id}
                            className="border p-4 rounded shadow-sm bg-white flex flex-col gap-2"
                        >
                            <div className="flex items-center gap-3">
                                {review.userImage ? (
                                    <img
                                        src={review.userImage}
                                        alt="Reviewer"
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                                        <FaUserCircle className="w-10 h-10" />
                                    </div>
                                )}
                                <div>
                                    <p className="font-semibold">{review.userName || "Unknown"}</p>
                                    <p className="text-xs text-gray-500">{review.userEmail}</p>
                                </div>
                            </div>


                            <p className="text-sm text-gray-700">{review.comment}</p>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        className={star <= (review.rating || 0) ? "text-yellow-500" : "text-gray-300"}
                                    >
                                        <FaStar />
                                    </span>
                                ))}
                            </div>
                            <p className="text-sm font-semibold">
                                Property: <span className=" text-primary">{review.propertyTitle || "N/A"}</span>
                            </p>

                            <div className="flex gap-2 mt-2">
                                <Link
                                    to={`/property/${review.propertyId}`}
                                    className="btn btn-xs btn-primary"
                                >
                                    Property Details
                                </Link>

                                <button
                                    onClick={() =>
                                        Swal.fire({
                                            title: "Delete?",
                                            text: "This review will be removed permanently.",
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

export default ManageReviews;
