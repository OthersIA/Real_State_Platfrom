import { useContext, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../../../context/AuthContext";
import LoadingFallback from "../../../components/shared/LoadingFallback";
import { Link } from "react-router";
import AOS from "aos";
import "aos/dist/aos.css";
import { Helmet } from "react-helmet-async";

const RequestedProperties = () => {
    const { user } = useContext(AuthContext);
    const queryClient = useQueryClient();

    useEffect(() => {
        AOS.init({ duration: 800, easing: "ease-in-out", once: true });
    }, []);

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
        <section className="container mx-auto p-4" data-aos="fade-up">
            <Helmet>
                <title>Requested Properties | RealEstate</title>
            </Helmet>
            <h2 className="text-2xl font-bold mb-4 text-[#00BBA7]">Requested Properties</h2>

            {offers.length === 0 ? (
                <p>No offers have been made yet.</p>
            ) : (
                <table className="table w-full">
                    <thead>
                        <tr className="bg-base-200">
                            <th>#</th>
                            <th>Property Title</th>
                            <th>Buyer Email</th>
                            <th>Buyer Name</th>
                            <th>Offered Price</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {offers.map((offer, idx) => (
                            <tr key={offer._id} data-aos="fade-up">
                                <td>{idx + 1}</td>
                                <td>{offer.propertyTitle}</td>
                                <td>{offer.buyerEmail}</td>
                                <td>{offer.buyerName}</td>
                                <td>${offer.offerAmount}</td>
                                <td>
                                    {offer.status === "pending" && (
                                        <span className="badge bg-yellow-500 text-white">Pending</span>
                                    )}
                                    {offer.status === "accepted" && (
                                        <span className="badge bg-[#00BBA7] text-white">Accepted</span>
                                    )}
                                    {offer.status === "rejected" && (
                                        <span className="badge badge-error">Rejected</span>
                                    )}
                                    {offer.status === "bought" && (
                                        <span className="badge badge-success">Sold</span>
                                    )}
                                </td>
                                <td className="flex flex-wrap gap-2">
                                    {offer.status === "pending" ? (
                                        <>
                                            <button
                                                onClick={() => acceptOffer.mutate(offer._id)}
                                                className="btn btn-xs border border-[#00BBA7] text-[#00BBA7] hover:bg-[#00BBA7] hover:text-white"
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
                                        <Link to={`/property/${offer.propertyId}`}>
                                            <button className="btn btn-xs border border-[#00BBA7] text-[#00BBA7] hover:bg-[#00BBA7] hover:text-white">
                                                Details
                                            </button>
                                        </Link>
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
