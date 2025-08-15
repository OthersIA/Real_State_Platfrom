import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import LoadingFallback from "../../../components/shared/LoadingFallback";
import { FaUserCircle } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import { Helmet } from "react-helmet-async";

const ManageUsers = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1); // ✅ pagination state
  const itemsPerPage = 10;

  useEffect(() => {
    AOS.init({ duration: 700, easing: "ease-in-out" });
  }, []);

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

  if (isLoading) return <LoadingFallback />;

  // ✅ pagination logic
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = users.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="container px-4 py-8 mx-auto" data-aos="fade-up">
      <Helmet>
        <title>Manage Users | RealEstate</title>
      </Helmet>
      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#00BBA7]">
        Manage Users
      </h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr className="bg-base-200">
              <th>#</th>
              <th>Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>Created At</th>
              <th>Last Login</th>
              <th>Role</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((u, idx) => (
              <tr
                key={u._id}
                data-aos="fade-up"
                className="transition-colors duration-300 hover:bg-[#00bba7]/20 cursor-pointer"
              >
                <td>{startIndex + idx + 1}</td>
                <td>
                  {u.photo ? (
                    <img
                      src={u.photo}
                      alt="user"
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                      <FaUserCircle className="w-10 h-10" />
                    </div>
                  )}
                </td>
                <td>{u.name || "N/A"}</td>
                <td>{u.email}</td>
                <td>
                  <p className="text-xs text-center text-gray-500">
                    {u?.created_at
                      ? new Date(u.created_at).toLocaleString()
                      : "N/A"}
                  </p>
                </td>
                <td>
                  <p className="text-xs text-center text-gray-500">
                    {u?.last_log_in
                      ? new Date(u.last_log_in).toLocaleString()
                      : "N/A"}
                  </p>
                </td>
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
                          onClick={() =>
                            updateRole.mutate({ id: u._id, role: "admin" })
                          }
                          className="btn btn-xs border border-[#00BBA7] text-[#00BBA7] hover:bg-[#00BBA7] hover:text-white transition"
                        >
                          Make Admin
                        </button>
                      )}
                      {u.role !== "agent" && (
                        <button
                          onClick={() =>
                            updateRole.mutate({ id: u._id, role: "agent" })
                          }
                          className="btn btn-xs border border-[#00BBA7] text-[#00BBA7] hover:bg-[#00BBA7] hover:text-white transition"
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
                          className="btn btn-xs border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
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
                    className="btn btn-xs border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            className="btn btn-sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            « Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`btn btn-sm ${
                currentPage === i + 1 ? "btn-active btn-primary" : ""
              }`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="btn btn-sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next »
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
