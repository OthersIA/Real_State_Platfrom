import { useContext, useState } from "react";
import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import LoadingFallback from "../components/shared/LoadingFallback";
import { FaStar } from "react-icons/fa";

const PropertyDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const queryClient = useQueryClient();

    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState(0);
    const [showModal, setShowModal] = useState(false);

    // ✅ Load property details
    const { data: property, isLoading } = useQuery({
        queryKey: ["property", id],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/properties/${id}`);
            return res.data;
        },
    });

    // ✅ Load reviews for this property
    const { data: reviews = [] } = useQuery({
        queryKey: ["reviews", id],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/reviews/${id}`);
            return res.data;
        },
    });

    // ✅ Check if already wishlisted
    const { data: isWishlisted, isLoading: isWishlistLoading } = useQuery({
        queryKey: ["wishlist", id, user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/wishlist/check?propertyId=${id}&userEmail=${user.email}`
            );
            return res.data.exists; // backend returns { exists: true/false }
        },
    });

    // ✅ Add to wishlist
    const addToWishlist = useMutation({
        mutationFn: async () => {
            await axios.post(`${import.meta.env.VITE_API_URL}/wishlist`, {
                propertyId: id,
                userEmail: user.email,
            });
        },
        onSuccess: () => {
            Swal.fire("Added to wishlist!", "", "success");
            queryClient.invalidateQueries(["wishlist", id, user?.email]);
        },
        onError: () => {
            Swal.fire("Failed to add to wishlist", "", "error");
        },
    });

    // ✅ Add review
    const addReview = useMutation({
        mutationFn: async () => {
            await axios.post(`${import.meta.env.VITE_API_URL}/reviews`, {
                propertyId: id,
                userEmail: user.email,
                userName: user.displayName,
                comment: reviewText,
                rating,
                createdAt: new Date(),
            });
        },
        onSuccess: () => {
            setReviewText("");
            setRating(0);
            Swal.fire("Review added!", "", "success");
            setShowModal(false);
            queryClient.invalidateQueries(["reviews", id]);
        },
        onError: () => {
            Swal.fire("Failed to add review", "", "error");
        },
    });

    if (isLoading) return <LoadingFallback />;

    // ✅ Calculate average rating
    const avgRating =
        reviews.length > 0
            ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
            : null;

    return (
        <section className="max-w-4xl mx-auto p-4">
            <h2 className="text-3xl font-bold mb-2">{property.title}</h2>

            <div className="w-full md:w-96">
                <img
                    src={property.image}
                    alt="Property"
                    className="w-full rounded mb-4"
                />
            </div>

            <p><strong>Location:</strong> {property.location}</p>
            <p><strong>Agent:</strong> {property.agentName}</p>
            <p><strong>Verification:</strong> {property.verificationStatus}</p>
            <p><strong>Price:</strong> ${property.minPrice} - ${property.maxPrice}</p>
            {avgRating && (
                <p className="mt-2">
                    <strong>Average Rating:</strong>{" "}
                    {avgRating} ⭐️
                </p>
            )}
            <p className="mt-4">{property.description || "No description provided."}</p>

            <button
                className="btn btn-primary mt-4"
                onClick={() => addToWishlist.mutate()}
                disabled={isWishlistLoading || addToWishlist.isLoading || isWishlisted}
            >
                {isWishlistLoading
                    ? "Checking..."
                    : isWishlisted
                        ? "Already in Wishlist"
                        : "Add to Wishlist"}
            </button>

            <div className="mt-8">
                <h3 className="text-2xl font-semibold mb-2">Reviews</h3>
                {reviews.length === 0 ? (
                    <p>No reviews yet.</p>
                ) : (
                    <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                        {reviews.map((r) => (
                            <div key={r._id} className="p-2 border rounded">
                                <p className="font-bold">{r.userName}</p>
                                <p className="text-sm text-gray-600">
                                    {new Date(r.createdAt).toLocaleString()}
                                </p>
                                <p className="text-yellow-500">
                                    {"⭐️".repeat(r.rating || 0)}
                                </p>
                                <p>{r.comment}</p>
                            </div>
                        ))}
                    </div>
                )}

                <button
                    className="btn btn-success mt-4"
                    onClick={() => setShowModal(true)}
                >
                    Add a Review
                </button>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded w-full max-w-md">
                        <h4 className="text-xl font-bold mb-2">Write your review</h4>

                        <div className="mb-4 flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className={`cursor-pointer text-xl ${rating >= star ? 'text-yellow-500' : 'text-gray-300'
                                        }`}
                                />
                            ))}
                        </div>

                        <textarea
                            className="textarea textarea-bordered w-full"
                            rows="3"
                            placeholder="Your review..."
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                        />
                        <div className="flex justify-end mt-4 gap-2">
                            <button
                                className="btn btn-ghost"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    if (!reviewText.trim()) {
                                        Swal.fire("Please enter a review.", "", "warning");
                                        return;
                                    }
                                    if (rating < 1) {
                                        Swal.fire("Please select a star rating.", "", "warning");
                                        return;
                                    }
                                    addReview.mutate();
                                }}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </section>
    );
};

export default PropertyDetails;
