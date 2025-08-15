import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router";
import Swal from "sweetalert2";
import { useEffect, useState, useMemo } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import LoadingFallback from "../../../components/shared/LoadingFallback";
import { Helmet } from "react-helmet-async";
import { FaCheck, FaCross, FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { ImCross } from "react-icons/im";

const ManageProperties = () => {
  const queryClient = useQueryClient();

  const [sortOrder, setSortOrder] = useState("");
  const [selectedAgentEmail, setSelectedAgentEmail] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    AOS.init({ duration: 700, easing: "ease-in-out" });
  }, []);

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["manage-properties"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/properties`);
      return res.data;
    },
  });

  const verifyProperty = useMutation({
    mutationFn: async (id) => {
      await axios.patch(`${import.meta.env.VITE_API_URL}/properties/verify/${id}`);
    },
    onSuccess: () => {
      Swal.fire("Verified!", "Property has been verified.", "success");
      queryClient.invalidateQueries(["manage-properties"]);
    },
  });

  const rejectProperty = useMutation({
    mutationFn: async (id) => {
      await axios.patch(`${import.meta.env.VITE_API_URL}/properties/reject/${id}`);
    },
    onSuccess: () => {
      Swal.fire("Rejected!", "Property has been rejected.", "success");
      queryClient.invalidateQueries(["manage-properties"]);
    },
  });

  const deleteProperty = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${import.meta.env.VITE_API_URL}/properties/${id}`);
    },
    onSuccess: () => {
      Swal.fire("Deleted!", "Property has been deleted.", "success");
      queryClient.invalidateQueries(["manage-properties"]);
    },
  });

  const uniqueAgentEmails = useMemo(() => {
    const emails = new Set();
    properties.forEach((property) => {
      if (property.agentEmail) emails.add(property.agentEmail);
    });
    return ["", ...Array.from(emails)];
  }, [properties]);

  const filteredAndSortedProperties = useMemo(() => {
    let filtered = properties;

    if (selectedAgentEmail) {
      filtered = filtered.filter(
        (property) => property.agentEmail === selectedAgentEmail
      );
    }

    if (selectedStatus) {
      if (selectedStatus === "pending") {
        filtered = filtered.filter(
          (property) =>
            !property.verificationStatus ||
            property.verificationStatus === "pending"
        );
      } else {
        filtered = filtered.filter(
          (property) => property.verificationStatus === selectedStatus
        );
      }
    }

    if (sortOrder) {
      filtered = [...filtered].sort((a, b) => {
        const dateA = a.createdDate ? new Date(a.createdDate) : new Date(0);
        const dateB = b.createdDate ? new Date(b.createdDate) : new Date(0);

        return sortOrder === "newest"
          ? dateB.getTime() - dateA.getTime()
          : dateA.getTime() - dateB.getTime();
      });
    }

    return filtered;
  }, [properties, selectedAgentEmail, selectedStatus, sortOrder]);

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(filteredAndSortedProperties.length / itemsPerPage);
  const paginatedProperties = filteredAndSortedProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) return <LoadingFallback />;

  return (
    <div className="px-4 py-8 overflow-x-auto">
      <Helmet>
        <title>Manage Properties | RealEstate</title>
      </Helmet>
      <div className="container mx-auto" data-aos="fade-up">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#00BBA7]">
          Manage Properties
        </h2>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="form-control">
            <label className="label">Sort by Date:</label>
            <select
              className="select select-bordered w-full max-w-xs"
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setCurrentPage(1); // reset page
              }}
            >
              <option value="">No Sorting</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">Filter by Agent Email:</label>
            <select
              className="select select-bordered w-full max-w-xs"
              value={selectedAgentEmail}
              onChange={(e) => {
                setSelectedAgentEmail(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Agents</option>
              {uniqueAgentEmails.map((email) => (
                <option key={email} value={email}>
                  {email}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">Filter by Status:</label>
            <select
              className="select select-bordered w-full max-w-xs"
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <table className="table w-full">
          <thead>
            <tr className="bg-base-200">
              <th>#</th>
              <th>Title</th>
              <th>Location</th>
              <th>Agent Name</th>
              <th>Agent Email</th>
              <th>Price Range</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProperties.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No properties found.
                </td>
              </tr>
            ) : (
              paginatedProperties.map((prop, idx) => (
                <tr key={prop._id} className="hover:bg-[#00BBA7]/10 transition" data-aos="fade-up">
                  <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                  <td>{prop.title}</td>
                  <td>{prop.location}</td>
                  <td>{prop.agentName}</td>
                  <td>{prop.agentEmail}</td>
                  <td>${prop.minPrice} - ${prop.maxPrice}</td>
                  <td>
                    {prop.verificationStatus === "verified" && (
                      <span className="badge bg-[#00BBA7] text-white">Verified</span>
                    )}
                    {prop.verificationStatus === "rejected" && (
                      <span className="badge bg-red-500 text-white">Rejected</span>
                    )}
                    {!prop.verificationStatus || prop.verificationStatus === "pending" ? (
                      <span className="badge bg-yellow-500 text-white">Pending</span>
                    ) : null}
                  </td>
                  <td className="flex flex-wrap gap-2">
                    <Link
                      to={`/property/${prop._id}`}
                      className="btn btn-xs border border-[#00BBA7] text-[#00BBA7] hover:bg-[#00BBA7] hover:text-white transition"
                    >
                      <FaEye className="text-xl"> </FaEye>
                    </Link>
                    {(!prop.verificationStatus || prop.verificationStatus === "pending") && (
                      <>
                        <button
                          onClick={() => verifyProperty.mutate(prop._id)}
                          className="btn btn-xs border border-[#00BBA7] text-[#00BBA7] hover:bg-[#00BBA7] hover:text-white transition"
                        >
                          <FaCheck className="text-xl" />
                        </button>
                        <button
                          onClick={() => rejectProperty.mutate(prop._id)}
                          className="btn btn-xs border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
                        >
                         <ImCross className="text-xl" />
                        </button>
                      </>
                    )}
                    {(prop.verificationStatus === "verified" || prop.verificationStatus === "rejected") && (
                      <button
                        onClick={() =>
                          Swal.fire({
                            title: "Delete?",
                            text: "This property will be removed permanently.",
                            icon: "warning",
                            showCancelButton: true,
                          }).then((result) => {
                            if (result.isConfirmed) deleteProperty.mutate(prop._id);
                          })
                        }
                        className="btn btn-xs border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
                      >
                        <MdDelete className="text-xl"></MdDelete>
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            <button
              className="btn btn-sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
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
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProperties;