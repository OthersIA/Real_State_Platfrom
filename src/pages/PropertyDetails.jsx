import { useContext, useState } from "react";
import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import LoadingFallback from "../components/shared/LoadingFallback";

const PropertyDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const queryClient = useQueryClient();

    const [reviewText, setReviewText] = useState("");

    // ✅ Load property
    const { data: property, isLoading } = useQuery({
        queryKey: ["property", id],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/properties/${id}`);
            return res.data;
        },
    });

    // ✅ Load reviews
    const { data: reviews = [] } = useQuery({
        queryKey: ["reviews", id],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/reviews/${id}`);
            return res.data;
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
                createdAt: new Date(),
            });
        },
        onSuccess: () => {
            setReviewText("");
            Swal.fire("Review added!", "", "success");
            queryClient.invalidateQueries(["reviews", id]);
        },
        onError: () => {
            Swal.fire("Failed to add review", "", "error");
        },
    });

    if (isLoading) return <LoadingFallback />;

    return (
        <section className="max-w-4xl mx-auto p-4">
            <h2 className="text-3xl font-bold mb-2">{property.title}</h2>
            <div className="w-96">
                <img src={property.image} alt="Property" className="w-full rounded mb-4" />
            </div>
            <p><strong>Location:</strong> {property.location}</p>
            <p><strong>Agent:</strong> {property.agentName}</p>
            <p><strong>Verification:</strong> {property.verificationStatus}</p>
            <p><strong>Price:</strong> ${property.minPrice} - ${property.maxPrice}</p>
            <p className="mt-4">{property.description || "No description provided."}</p>

            <button
                className="btn btn-primary mt-4"
                onClick={() => addToWishlist.mutate()}
            >
                Add to Wishlist
            </button>

            <div className="mt-8">
                <h3 className="text-2xl font-semibold mb-2">Reviews</h3>
                {reviews.length === 0 ? (
                    <p>No reviews yet.</p>
                ) : (
                    <div className="space-y-2">
                        {reviews.map((r) => (
                            <div key={r._id} className="p-2 border rounded">
                                <p className="font-bold">{r.userName}</p>
                                <p className="text-sm text-gray-600">{new Date(r.createdAt).toLocaleString()}</p>
                                <p>{r.comment}</p>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-4">
                    <h4 className="font-bold mb-2">Add a Review</h4>
                    <textarea
                        className="textarea textarea-bordered w-full"
                        rows="3"
                        placeholder="Your review..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                    />
                    <button
                        className="btn btn-success mt-2"
                        onClick={() => {
                            if (!reviewText.trim()) {
                                Swal.fire("Please enter a review.", "", "warning");
                                return;
                            }
                            addReview.mutate();
                        }}
                    >
                        Submit Review
                    </button>
                </div>
            </div>
        </section>
    );
};

export default PropertyDetails;
