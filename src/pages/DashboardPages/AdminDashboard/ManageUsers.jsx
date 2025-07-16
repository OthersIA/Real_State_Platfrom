import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import LoadingFallback from "../../../components/shared/LoadingFallback";
import { FaUserCircle } from "react-icons/fa";

const ManageUsers = () => {
    const queryClient = useQueryClient();

    const { data: users = [], isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`);
            return res.data;
        },
    });

    const updateRole = useMutation({
        mutationFn: ({ id, role }) =>
            axios.patch(`${import.meta.env.VITE_API_URL}/users/${id}`, { role }),
        onSuccess: () => {
            Swal.fire("Updated!", "", "success");
            queryClient.invalidateQueries(["users"]);
        },
    });

    const markAsFraud = useMutation({
        mutationFn: async ({ id }) => {
            await axios.patch(`${import.meta.env.VITE_API_URL}/users/${id}/mark-fraud`);
        },
        onSuccess: () => {
            Swal.fire("Marked as Fraud & properties removed!", "", "success");
            queryClient.invalidateQueries(["users"]);
        },
    });

    const deleteUser = useMutation({
        mutationFn: (id) => axios.delete(`${import.meta.env.VITE_API_URL}/users/${id}`),
        onSuccess: () => {
            Swal.fire("Deleted!", "", "success");
            queryClient.invalidateQueries(["users"]);
        },
        onError: () => {
            Swal.fire("Error", "Failed to delete user", "error");
        },
    });

    if (isLoading) return <LoadingFallback></LoadingFallback>

    return (
        <div className="container px-4 py-10 mx-auto">
            <h2 className="text-xl font-bold mb-4">Manage Users</h2>
            <div className='overflow-x-auto'>
                <table className="table w-full">
                    <thead>
                        <tr className="bg-base-200">
                            <th>#</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Created At</th>
                            <th>Role</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u, idx) => (
                            <tr key={u._id} className="">
                                <td>{idx + 1}</td>
                                <td>
                                    {u.photo ? (
                                        <img src={u.photo} alt="user" className="w-10 h-10 rounded-full" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                                            <FaUserCircle className="w-10 h-10" />
                                        </div>
                                    )}
                                </td>
                                <td>{u.name || "N/A"}</td>
                                <td>{u.email}</td>
                                <td>{new Date(u.created_at).toLocaleDateString()}</td>
                                <td>
                                    {u.role === "fraud" ? (
                                        <span className="badge badge-error">Fraud</span>
                                    ) : (
                                        <span className="badge">{u.role || "user"}</span>
                                    )}
                                </td>
                                <td className="flex justify-center items-center flex-wrap gap-2">
                                    {u.role !== "fraud" && (
                                        <>
                                            {u.role !== "admin" && (
                                                <button
                                                    onClick={() => updateRole.mutate({ id: u._id, role: "admin" })}
                                                    className="btn btn-xs btn-primary"
                                                >
                                                    Make Admin
                                                </button>
                                            )}
                                            {u.role !== "agent" && (
                                                <button
                                                    onClick={() => updateRole.mutate({ id: u._id, role: "agent" })}
                                                    className="btn btn-xs btn-secondary"
                                                >
                                                    Make Agent
                                                </button>
                                            )}
                                            {u.role === "agent" && (
                                                <button
                                                    onClick={() =>
                                                        Swal.fire({
                                                            title: "Mark as Fraud?",
                                                            text: "This will also remove their properties.",
                                                            icon: "warning",
                                                            showCancelButton: true,
                                                        }).then((result) => {
                                                            if (result.isConfirmed) {
                                                                markAsFraud.mutate({ id: u._id });
                                                            }
                                                        })
                                                    }
                                                    className="btn btn-xs btn-warning"
                                                >
                                                    Mark as Fraud
                                                </button>
                                            )}
                                        </>
                                    )}
                                    <button
                                        onClick={() =>
                                            Swal.fire({
                                                title: "Delete user?",
                                                text: "This will remove the user & properties.",
                                                icon: "warning",
                                                showCancelButton: true,
                                            }).then((result) => {
                                                if (result.isConfirmed) deleteUser.mutate(u._id);
                                            })
                                        }
                                        className="btn btn-xs btn-error"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;
