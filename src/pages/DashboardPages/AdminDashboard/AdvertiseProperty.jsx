import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import LoadingFallback from "../../../components/shared/LoadingFallback";

const AdvertiseProperty = () => {
    const queryClient = useQueryClient();

    const { data: properties = [], isLoading } = useQuery({
        queryKey: ["verifiedProperties"],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/property/verified`);
            return res.data;
        },
    });

    const addMutation = useMutation({
        mutationFn: async (id) => {
            return axios.patch(`${import.meta.env.VITE_API_URL}/properties/advertise/${id}`, {
                advertise: true,
            });
        },
        onSuccess: () => {
            Swal.fire("Success!", "Property advertised!", "success");
            queryClient.invalidateQueries(["verifiedProperties"]);
        },
    });

    const removeMutation = useMutation({
        mutationFn: async (id) => {
            return axios.patch(`${import.meta.env.VITE_API_URL}/properties/advertise/${id}`, {
                advertise: false,
            });
        },
        onSuccess: () => {
            Swal.fire("Removed!", "Advertisement removed!", "info");
            queryClient.invalidateQueries(["verifiedProperties"]);
        },
    });

    const handleAddAdvertise = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to advertise this property?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, advertise it!",
        }).then((result) => {
            if (result.isConfirmed) {
                addMutation.mutate(id);
            }
        });
    };

    const handleRemoveAdvertise = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to remove this property from advertisements?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, remove it!",
        }).then((result) => {
            if (result.isConfirmed) {
                removeMutation.mutate(id);
            }
        });
    };

    if (isLoading) return <LoadingFallback />;

    return (
        <section className="p-8">
            <h2 className="text-2xl font-bold mb-4">Advertise Properties</h2>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr className="bg-base-200">
                            <th>Image</th>
                            <th>Title</th>
                            <th>Price Range</th>
                            <th>Agent</th>
                            <th>Advertise</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {properties.map((property) => (
                            <tr key={property._id}>
                                <td>
                                    <img src={property.image} alt={property.title} className="w-20 rounded" />
                                </td>
                                <td>{property.title}</td>
                                <td>
                                    ${property.minPrice} - ${property.maxPrice}
                                </td>
                                <td>{property.agentName}</td>
                                <td>
                                    <button
                                        onClick={() => handleAddAdvertise(property._id)}
                                        className="btn btn-primary btn-xs"
                                        disabled={property.advertise}
                                    >
                                        Add Advertise
                                    </button>
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleRemoveAdvertise(property._id)}
                                        className="btn btn-error btn-xs"
                                        disabled={!property.advertise}
                                    >
                                        Remove Advertise
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default AdvertiseProperty;
