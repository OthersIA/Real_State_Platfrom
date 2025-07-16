import { useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router";
import { AuthContext } from "../../../context/AuthContext";
import LoadingFallback from "../../../components/shared/LoadingFallback";

const MyReviews = () => {
    const { user } = useContext(AuthContext);
    const queryClient = useQueryClient();

    // ✅ Fetch all reviews by logged-in user
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

    // ✅ Delete mutation
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
        <section className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">My Reviews</h2>

            {reviews.length === 0 ? (
                <p>You haven’t added any reviews yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reviews.map((review) => (
                        <div
                            key={review._id}
                            className="border p-4 rounded shadow-sm bg-white"
                        >
                            <h3 className="text-lg font-semibold">
                                {review.propertyTitle || "Property"}
                            </h3>
                            <p className="text-sm text-gray-600">
                                Agent: {review?.agentName || "N/A"}
                            </p>
                            <p className="text-xs text-gray-500">
                                {new Date(review.createdAt).toLocaleString()}
                            </p>
                            <p className="mt-2">{review.comment}</p>

                            <div className="flex gap-2 mt-3">
                                <Link
                                    to={`/property/${review.propertyId}`}
                                    className="btn btn-xs btn-primary"
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
