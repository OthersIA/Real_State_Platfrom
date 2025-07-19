import { useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../../../context/AuthContext";
import LoadingFallback from "../../../components/shared/LoadingFallback";
import { Link } from "react-router";

const RequestedProperties = () => {
    const { user } = useContext(AuthContext);
    const queryClient = useQueryClient();

    // ✅ Load offers for this agent
    const { data: offers = [], isLoading } = useQuery({
        queryKey: ["agent-offers", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/agent/offers?email=${user.email}`
            );
            return res.data;
        },
    });

    // ✅ Accept mutation
    const acceptOffer = useMutation({
        mutationFn: async (id) => {
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/agent/offers/accept/${id}`
            );
        },
        onSuccess: () => {
            Swal.fire("Accepted!", "Offer accepted and others rejected.", "success");
            queryClient.invalidateQueries(["agent-offers", user?.email]);
        },
        onError: () => {
            Swal.fire("Error", "Failed to accept offer.", "error");
        },
    });

    // ✅ Reject mutation
    const rejectOffer = useMutation({
        mutationFn: async (id) => {
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/agent/offers/reject/${id}`
            );
        },
        onSuccess: () => {
            Swal.fire("Rejected!", "Offer rejected.", "success");
            queryClient.invalidateQueries(["agent-offers", user?.email]);
        },
        onError: () => {
            Swal.fire("Error", "Failed to reject offer.", "error");
        },
    });

    if (isLoading) return <LoadingFallback />;

    return (
        <section className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Requested Properties</h2>

            {offers.length === 0 ? (
                <p>No offers have been made yet.</p>
            ) : (
                <table className="table w-full">
                    <thead>
                        <tr className="bg-base-200">
                            <th>#</th>
                            <th>Property Title</th>
                            <th>Location</th>
                            <th>Buyer Email</th>
                            <th>Buyer Name</th>
                            <th>Offered Price</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {offers.map((offer, idx) => (
                            <tr key={offer._id}>
                                <td>{idx + 1}</td>
                                <td>{offer.propertyTitle}</td>
                                <td>{offer.propertyLocation}</td>
                                <td>{offer.buyerEmail}</td>
                                <td>{offer.buyerName}</td>
                                <td>${offer.offerAmount}</td>
                                <td>
                                    {offer.status === "pending" && (
                                        <span className="badge badge-warning">Pending</span>
                                    )}
                                    {offer.status === "accepted" && (
                                        <span className="badge badge-success">Accepted</span>
                                    )}
                                    {offer.status === "rejected" && (
                                        <span className="badge badge-error">Rejected</span>
                                    )}
                                    {offer.status === "bought" && (
                                        <span className="badge badge-error">Sold</span>
                                    )}
                                </td>
                                <td className="flex flex-wrap gap-2">
                                    {offer.status === "pending" ? (
                                        <>
                                            <button
                                                onClick={() => acceptOffer.mutate(offer._id)}
                                                className="btn btn-xs btn-success"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => rejectOffer.mutate(offer._id)}
                                                className="btn btn-xs btn-error"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Link to={`/property/${offer.propertyId}`} >
                                                <button className="btn btn-xs btn-secondary">
                                                    Details
                                                </button>
                                            </Link>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </section>
    );
};

export default RequestedProperties;