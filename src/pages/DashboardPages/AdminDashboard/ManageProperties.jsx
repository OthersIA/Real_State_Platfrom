import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router";
import Swal from "sweetalert2";
import { useEffect, useState, useMemo } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import LoadingFallback from "../../../components/shared/LoadingFallback";
import { Helmet } from "react-helmet-async";

const ManageProperties = () => {
  const queryClient = useQueryClient();

  // State for sorting
  const [sortOrder, setSortOrder] = useState(""); // 'newest' | 'oldest' | ''

  // State for agent email filter
  const [selectedAgentEmail, setSelectedAgentEmail] = useState("");

  // State for verification status filter
  const [selectedStatus, setSelectedStatus] = useState(""); // 'verified' | 'pending' | 'rejected' | ''

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
    onError: () => {
      Swal.fire("Error", "Failed to verify property.", "error");
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
    onError: () => {
      Swal.fire("Error", "Failed to reject property.", "error");
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
    onError: () => {
      Swal.fire("Error", "Failed to delete property.", "error");
    },
  });


  // Get unique agent emails for the dropdown
  const uniqueAgentEmails = useMemo(() => {
    const emails = new Set();
    properties.forEach((property) => {
      if (property.agentEmail) {
        emails.add(property.agentEmail);
      }
    });
    return ["", ...Array.from(emails)]; // Add an empty option for "All Agents"
  }, [properties]);

  // Filter and sort properties based on state
  const filteredAndSortedProperties = useMemo(() => {
    let filtered = properties;

    // 1. Filter by Agent Email
    if (selectedAgentEmail) {
      filtered = filtered.filter(
        (property) => property.agentEmail === selectedAgentEmail
      );
    }

    // 2. Filter by Verification Status
    if (selectedStatus) {
      // Handle the case where verificationStatus might be undefined/null or "pending"
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

    // 3. Sort by Created Date
    if (sortOrder) {
      filtered = [...filtered].sort((a, b) => {
        const dateA = a.createdDate ? new Date(a.createdDate) : new Date(0);
        const dateB = b.createdDate ? new Date(b.createdDate) : new Date(0);

        if (sortOrder === "newest") {
          return dateB.getTime() - dateA.getTime(); // Newest first
        } else {
          return dateA.getTime() - dateB.getTime(); // Oldest first
        }
      });
    }

    return filtered;
  }, [properties, selectedAgentEmail, selectedStatus, sortOrder]);


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

        {/* Sorting and Filtering Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Sort by Created Date */}
          <div className="form-control">
            <label htmlFor="sortDate" className="label">
              <span className="label-text">Sort by Date:</span>
            </label>
            <select
              id="sortDate"
              className="select select-bordered w-full max-w-xs"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="">No Sorting</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {/* Filter by Agent Email */}
          <div className="form-control">
            <label htmlFor="filterEmail" className="label">
              <span className="label-text">Filter by Agent Email:</span>
            </label>
            <select
              id="filterEmail"
              className="select select-bordered w-full max-w-xs"
              value={selectedAgentEmail}
              onChange={(e) => setSelectedAgentEmail(e.target.value)}
            >
              <option value="">All Agents</option>
              {uniqueAgentEmails.map((email) => (
                <option key={email} value={email}>
                  {email}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Verification Status */}
          <div className="form-control">
            <label htmlFor="filterStatus" className="label">
              <span className="label-text">Filter by Status:</span>
            </label>
            <select
              id="filterStatus"
              className="select select-bordered w-full max-w-xs"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
        {/* End Sorting and Filtering Controls */}

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
            {filteredAndSortedProperties.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-4 text-gray-500">
                  No properties found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredAndSortedProperties.map((prop, idx) => (
                <tr
                  key={prop._id}
                  className="hover:bg-[#00BBA7]/10 transition"
                  data-aos="fade-up"
                >
                  <td>{idx + 1}</td>
                  <td>{prop.title}</td>
                  <td>{prop.location}</td>
                  <td>{prop.agentName}</td>
                  <td>{prop.agentEmail}</td>
                  <td>
                    ${prop.minPrice} - ${prop.maxPrice}
                  </td>
                  <td>
                    {prop.verificationStatus === "verified" && (
                      <span className="badge bg-[#00BBA7] text-white">
                        Verified
                      </span>
                    )}
                    {prop.verificationStatus === "rejected" && (
                      <span className="badge bg-red-500 text-white">
                        Rejected
                      </span>
                    )}
                    {!prop.verificationStatus ||
                      prop.verificationStatus === "pending" ? (
                      <span className="badge bg-yellow-500 text-white">
                        Pending
                      </span>
                    ) : null}
                  </td>
                  <td className="flex flex-wrap gap-2">
                    <Link
                      to={`/property/${prop._id}`}
                      className="btn btn-xs border border-[#00BBA7] text-[#00BBA7] hover:bg-[#00BBA7] hover:text-white transition"
                    >
                      Property Details
                    </Link>

                    {(!prop.verificationStatus ||
                      prop.verificationStatus === "pending") && (
                        <>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              verifyProperty.mutate(prop._id);
                            }}
                            className="btn btn-xs border border-[#00BBA7] text-[#00BBA7] hover:bg-[#00BBA7] hover:text-white transition"
                          >
                            Verify
                          </button>

                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              rejectProperty.mutate(prop._id);
                            }}
                            className="btn btn-xs border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
                          >
                            Reject
                          </button>
                        </>
                      )}

                    {(prop.verificationStatus === "verified" ||
                      prop.verificationStatus === "rejected") && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            Swal.fire({
                              title: "Delete?",
                              text: "This property will be removed permanently.",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonText: "Yes, delete it!",
                            }).then((result) => {
                              if (result.isConfirmed) {
                                deleteProperty.mutate(prop._id);
                              }
                            });
                          }}
                          className="btn btn-xs border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
                        >
                          Delete
                        </button>
                      )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProperties;