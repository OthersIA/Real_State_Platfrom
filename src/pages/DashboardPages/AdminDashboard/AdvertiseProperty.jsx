import { useEffect, useState, useMemo } from "react"; // Import useState and useMemo
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";
import LoadingFallback from "../../../components/shared/LoadingFallback";
import { NavLink } from "react-router";

const AdvertiseProperty = () => {
  const queryClient = useQueryClient();

  // State for sorting
  const [sortOrder, setSortOrder] = useState(""); // 'newest' | 'oldest' | ''

  // State for email search/filter
  const [selectedAgentEmail, setSelectedAgentEmail] = useState("");

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

  // --- Filtering and Sorting Logic ---

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

    // 2. Sort by Created Date
    if (sortOrder) {
      filtered = [...filtered].sort((a, b) => {
        const dateA = new Date(a.createdDate);
        const dateB = new Date(b.createdDate);
        if (sortOrder === "newest") {
          return dateB.getTime() - dateA.getTime(); // Newest first
        } else {
          return dateA.getTime() - dateB.getTime(); // Oldest first
        }
      });
    }

    return filtered;
  }, [properties, selectedAgentEmail, sortOrder]);

  // --- End Filtering and Sorting Logic ---

  if (isLoading) return <LoadingFallback />;

  return (
    <section className="px-4 py-8" data-aos="fade-up">
       <Helmet>
                <title>Manage ReviewsAdvertise Propertie | RealEstate</title>
            </Helmet>
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#00BBA7]">
          Advertise Properties
        </h2>

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
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-200 text-base-content">
                <th>Image</th>
                <th>Title</th>
                <th>Price Range</th>
                <th>Agent</th>
                <th>Created Date</th> {/* Added Created Date column */}
                <th>Stats</th>
                <th>Advertise</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedProperties.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-500">
                    No properties found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredAndSortedProperties.map((property) => (
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
                    </td>{" "}
                    {/* Display formatted date */}
                    <td>
                      {property?.status === "sold" ? (
                        <span className="text-red-500 font-semibold">
                          {property.status}
                        </span>
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
      </div>
    </section>
  );
};

export default AdvertiseProperty;