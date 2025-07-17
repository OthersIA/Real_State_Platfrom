import { useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router";
import { AuthContext } from "../../../context/AuthContext";
import LoadingFallback from "../../../components/shared/LoadingFallback";

const MyAddedProperties = () => {
    const { user } = useContext(AuthContext);
    const queryClient = useQueryClient();

    // ✅ Load current user's properties
    const { data: properties = [], isLoading } = useQuery({
        queryKey: ["my-properties", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/properties?email=${user.email}`
            );
            return res.data;
        },
    });

    // ✅ Delete mutation
    const deleteProperty = useMutation({
        mutationFn: async (id) => {
            await axios.delete(`${import.meta.env.VITE_API_URL}/properties/${id}`);
        },
        onSuccess: () => {
            Swal.fire("Deleted!", "Property has been deleted.", "success");
            queryClient.invalidateQueries(["my-properties"]);
        },
        onError: () => {
            Swal.fire("Error", "Failed to delete property.", "error");
        },
    });

    if (isLoading) return <LoadingFallback></LoadingFallback>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">My Added Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {properties.map((prop) => (
                    <div
                        key={prop._id}
                        className="card bg-base-100 shadow p-4 space-y-2 border"
                    >
                        <img
                            src={prop.image}
                            alt="Property"
                            className="w-full h-48 object-cover rounded"
                        />
                        <h3 className="text-xl font-semibold">{prop.title}</h3>
                        <p className="text-sm text-gray-600">{prop.location}</p>
                        <div className="flex items-center gap-2">
                            {user.photoURL ? (
                                <img
                                    src={user.photoURL}
                                    alt="Agent"
                                    className="w-10 h-10 rounded-full"
                                />
                            ) : (
                                <div className="w-10 h-10 bg-gray-300 rounded-full" />
                            )}
                            <span>{prop.agentName}</span>
                        </div>
                        <p>
                            <strong>Verification:</strong>{" "}
                            <span
                                className={`badge ${prop.verificationStatus === "verified"
                                    ? "badge-success"
                                    : prop.verificationStatus === "rejected"
                                        ? "badge-error"
                                        : "badge-warning"
                                    }`}
                            >
                                {prop.verificationStatus || "pending"}
                            </span>
                        </p>
                        <p>
                            <strong>Price Range:</strong> ${prop.minPrice} - ${prop.maxPrice}
                        </p>

                        <div className="flex gap-2 mt-2">
                            <Link to={`/property/${prop._id}`}
                                className="btn btn-xs btn-primary"
                            >
                                Details
                            </Link>
                            {prop.verificationStatus !== "rejected" && (
                                <Link
                                    to={`/dashboard/update-properties/${prop._id}`}
                                    className="btn btn-xs btn-primary"
                                >
                                    Update
                                </Link>
                            )}
                            <button
                                onClick={() =>
                                    Swal.fire({
                                        title: "Delete?",
                                        text: "This property will be removed.",
                                        icon: "warning",
                                        showCancelButton: true,
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            deleteProperty.mutate(prop._id);
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
        </div>
    );
};

export default MyAddedProperties;
