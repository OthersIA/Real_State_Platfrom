import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import LoadingFallback from "../../../components/shared/LoadingFallback";
import { Link } from "react-router";
import AOS from "aos";
import "aos/dist/aos.css";
import { Helmet } from "react-helmet-async";

const MySoldProperties = () => {
    const { user } = useContext(AuthContext);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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

    // pagination logic
    const totalPages = Math.ceil(soldProperties.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = soldProperties.slice(startIndex, startIndex + itemsPerPage);

    return (
        <section className="container mx-auto p-4" data-aos="fade-up">
            <Helmet>
                <title>My Sold Properties | RealEstate</title>
            </Helmet>
            <h2 className="text-2xl font-bold mb-4 text-[#00BBA7]">My Sold Properties</h2>
            <p className="mb-4 font-semibold">
                Total Sold Amount:{" "}
                <span className="text-[#00BBA7]">${totalSoldAmount}</span>
            </p>

            {soldProperties.length === 0 ? (
                <p>No properties sold yet.</p>
            ) : (
                <div>
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
                                {currentItems.map((item, index) => (
                                    <tr key={index} className="hover" data-aos="fade-up">
                                        <td>{startIndex + index + 1}</td>
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

                    {/* pagination controls */}
                    <div className="flex justify-center gap-2 mt-4">
                        <button
                            className="btn btn-sm"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Prev
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                className={`btn btn-sm ${currentPage === i + 1 ? "btn-active bg-[#00BBA7] text-white" : ""}`}
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            className="btn btn-sm"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default MySoldProperties;
