import { useEffect, useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";
import LoadingFallback from "../../../components/shared/LoadingFallback";
import { NavLink } from "react-router";
import { Helmet } from "react-helmet-async";

const AdvertiseProperty = () => {
  const queryClient = useQueryClient();

  // State for sorting and filtering
  const [sortOrder, setSortOrder] = useState("");
  const [selectedAgentEmail, setSelectedAgentEmail] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-in-out", once: true });
  }, []);

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["verifiedProperties"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/property/verified`);
      return res.data;
    },
  });

  const addMutation = useMutation({
    mutationFn: async (id) =>
      axios.patch(`${import.meta.env.VITE_API_URL}/properties/advertise/${id}`, {
        advertise: true,
      }),
    onSuccess: () => {
      Swal.fire("Success!", "Property is now advertised.", "success");
      queryClient.invalidateQueries(["verifiedProperties"]);
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (id) =>
      axios.patch(`${import.meta.env.VITE_API_URL}/properties/advertise/${id}`, {
        advertise: false,
      }),
    onSuccess: () => {
      Swal.fire("Removed!", "Advertisement has been removed.", "info");
      queryClient.invalidateQueries(["verifiedProperties"]);
    },
  });

  const handleAddAdvertise = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This property will be advertised.",
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
      text: "This property will no longer be advertised.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        removeMutation.mutate(id);
      }
    });
  };

  // Filtering & sorting
  const uniqueAgentEmails = useMemo(() => {
    const emails = new Set();
    properties.forEach((property) => {
      if (property.agentEmail) {
        emails.add(property.agentEmail);
      }
    });
    return ["", ...Array.from(emails)];
  }, [properties]);

  const filteredAndSortedProperties = useMemo(() => {
    let filtered = properties;

    if (selectedAgentEmail) {
      filtered = filtered.filter((property) => property.agentEmail === selectedAgentEmail);
    }

    if (sortOrder) {
      filtered = [...filtered].sort((a, b) => {
        const dateA = new Date(a.createdDate);
        const dateB = new Date(b.createdDate);
        return sortOrder === "newest"
          ? dateB.getTime() - dateA.getTime()
          : dateA.getTime() - dateB.getTime();
      });
    }

    return filtered;
  }, [properties, selectedAgentEmail, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredAndSortedProperties.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading) return <LoadingFallback />;

  return (
    <section className="px-4 py-8" data-aos="fade-up">
      <Helmet>
        <title>Advertise Properties | RealEstate</title>
      </Helmet>
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#00BBA7]">
          Advertise Properties
        </h2>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
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
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-200 text-base-content">
                <th>Image</th>
                <th>Title</th>
                <th>Price Range</th>
                <th>Agent</th>
                <th>Created Date</th>
                <th>Stats</th>
                <th>Advertise</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-500">
                    No properties found matching your criteria.
                  </td>
                </tr>
              ) : (
                currentItems.map((property) => (
                  <tr
                    key={property._id}
                    data-aos="fade-up"
                    className="transition-colors duration-300 hover:bg-[#00bba7]/20 cursor-pointer"
                  >
                    <td>
                      <NavLink to={`/property/${property._id}`}>
                        <img
                          src={property.image}
                          alt={property.title}
                          className="w-20 h-14 object-cover rounded ring ring-[#00BBA7] ring-offset-2"
                        />
                      </NavLink>
                    </td>
                    <td className="font-medium">{property.title}</td>
                    <td>
                      ${property.minPrice} - ${property.maxPrice}
                    </td>
                    <td>{property.agentName}</td>
                    <td>
                      {property.createdDate
                        ? new Date(property.createdDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td>
                      {property?.status === "sold" ? (
                        <span className="text-red-500 font-semibold">{property.status}</span>
                      ) : (
                        <span className="text-blue-600">Verified</span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => handleAddAdvertise(property._id)}
                        className="btn btn-xs border border-[#00BBA7] hover:bg-[#00BBA7] hover:text-white transition hover:scale-105"
                        disabled={property.advertise}
                      >
                        Advertise
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleRemoveAdvertise(property._id)}
                        className="btn btn-xs border border-red-500 hover:bg-red-500 hover:text-white transition hover:scale-105"
                        disabled={!property.advertise}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="btn btn-sm"
              disabled={currentPage === 1}
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`btn btn-sm ${currentPage === idx + 1 ? "btn-active bg-[#00BBA7] text-white" : ""}`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="btn btn-sm"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdvertiseProperty;
