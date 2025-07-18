import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router";
import LoadingFallback from "../shared/LoadingFallback";

const AdvertisementSection = () => {
    // Fetch advertised properties
    const { data: properties = [], isLoading } = useQuery({
        queryKey: ["advertisedProperties"],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/properties?advertised=true`);
            return res.data.slice(0, 4); // Just take top 4 for now
        },
    });

    if (isLoading) return <LoadingFallback />;

    if (properties.length === 0) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold mb-4">No Advertised Properties Yet!</h2>
            </div>
        );
    }

    return (
        <section className="container mx-auto p-4">
            <h2 className="text-3xl font-bold mb-6">Featured Advertisements</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {properties.map((property) => (
                    <div
                        key={property._id}
                        className="card shadow-md rounded-lg overflow-hidden border border-base-200"
                    >
                        <img
                            src={property.image}
                            alt={property.title}
                            className="h-48 w-full object-cover"
                        />

                        <div className="p-4">
                            <h3 className="text-lg font-bold mb-2">{property.location}</h3>
                            <p className="text-sm mb-1">
                                <strong>Price:</strong> ${property.minPrice} - ${property.maxPrice}
                            </p>
                            <p className="text-sm mb-3">
                                <strong>Status:</strong> {property.verificationStatus}
                            </p>

                            <Link
                                to={`/property/${property._id}`}
                                className="btn btn-primary btn-sm w-full"
                            >
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default AdvertisementSection;
