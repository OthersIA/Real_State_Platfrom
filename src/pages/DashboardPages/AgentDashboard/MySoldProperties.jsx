import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import LoadingFallback from "../../../components/shared/LoadingFallback";
import { Link } from "react-router";
import AOS from "aos";
import "aos/dist/aos.css";

const MySoldProperties = () => {
    const { user } = useContext(AuthContext);

    useEffect(() => {
        AOS.init({ duration: 800, easing: "ease-in-out", once: true });
    }, []);

    const { data, isLoading } = useQuery({
        queryKey: ["soldProperties", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/sold-properties?agentEmail=${user.email}`
            );
            return res.data;
        },
    });

    const { totalSoldAmount = 0, soldProperties = [] } = data || {};

    if (isLoading) return <LoadingFallback />;

    return (
        <section className="container mx-auto p-4" data-aos="fade-up">
            <h2 className="text-2xl font-bold mb-4 text-[#00BBA7]">My Sold Properties</h2>
            <p className="mb-4 font-semibold">
                Total Sold Amount:{" "}
                <span className="text-[#00BBA7]">${totalSoldAmount}</span>
            </p>

            {soldProperties.length === 0 ? (
                <p>No properties sold yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr className="bg-base-200">
                                <th>#</th>
                                <th>Property Title</th>
                                <th>Location</th>
                                <th>Buyer Name</th>
                                <th>Buyer Email</th>
                                <th>Sold Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {soldProperties.map((item, index) => (
                                <tr key={index} className="hover" data-aos="fade-up">
                                    <td>{index+1}</td>
                                    <td>{item.propertyTitle}</td>
                                    <td>{item.propertyLocation}</td>
                                    <td>{item.buyerName}</td>
                                    <td>{item.buyerEmail}</td>
                                    <td>${item.amountPaid}</td>
                                    <td>
                                        <Link to={`/property/${item.propertyId}`}>
                                            <button className="btn btn-xs border border-[#00BBA7] text-[#00BBA7] hover:bg-[#00BBA7] hover:text-white">
                                                Details
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
};

export default MySoldProperties;
