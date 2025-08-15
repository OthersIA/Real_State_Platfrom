import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router";
import { useContext, useState, useEffect } from "react";
import LoadingFallback from "../components/shared/LoadingFallback";
import { AuthContext } from "../context/AuthContext";
import { MdVisibility } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import { Helmet } from "react-helmet-async";

const AllProperties = () => {
  const { user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [dateOrder, setDateOrder] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1); // ✅ Pagination state
  const itemsPerPage = 9;

  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-in-out", once: true });
  }, []);

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["all-properties"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/properties`);
      return res.data.filter(
        (p) => p.verificationStatus === "verified" || p.status === "sold"
      );
    },
  });

  if (isLoading) return <LoadingFallback />;

  const filteredProperties = properties.filter((prop) => {
    const matchesLocation = prop.location
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const propMin = parseFloat(prop.minPrice) || 0;
    const propMax = parseFloat(prop.maxPrice) || 0;

    const min = parseFloat(minPrice) || 0;
    const max = parseFloat(maxPrice) || Infinity;

    const matchesPrice = propMax >= min && propMin <= max;

    return matchesLocation && matchesPrice;
  });

  const sortedProperties = [...filteredProperties];

  if (sortOrder) {
    sortedProperties.sort((a, b) => {
      const priceA = parseFloat(a.minPrice);
      const priceB = parseFloat(b.minPrice);
      return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
    });
  }

  if (dateOrder) {
    sortedProperties.sort((a, b) => {
      const dateA = new Date(a.createdDate);
      const dateB = new Date(b.createdDate);
      return dateOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }

  // ✅ Pagination logic
  const totalPages = Math.ceil(sortedProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProperties = sortedProperties.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" }); // Auto scroll up
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>All Properties | RealEstate</title>
      </Helmet>
      <h2
        className="text-center text-3xl md:text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#00BBA7] to-[#009d8f]"
        data-aos="fade-down"
      >
        All Verified Properties
      </h2>

      {/* Search, Sort & Price Filters */}
      <div
        className="mb-8 grid grid-cols-2 lg:grid-cols-6 gap-4 items-center justify-end w-3/4 mx-auto"
        data-aos="fade-up"
      >
        <input
          type="text"
          placeholder="Search by location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full col-span-2 md:col-span-2"
        />

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="select select-bordered w-full "
        >
          <option value="">Price: No Limit</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>

        <select
          value={dateOrder}
          onChange={(e) => setDateOrder(e.target.value)}
          className="select select-bordered w-full "
        >
          <option value="">No Sorting</option>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>

        <input
          type="number"
          min="0"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="input input-bordered w-full "
        />

        <input
          type="number"
          min="0"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="input input-bordered w-full "
        />
      </div>

      {paginatedProperties.length === 0 && (
        <p className="text-gray-500 text-lg text-center">
          No matching properties found.
        </p>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
        {paginatedProperties.map((prop) => (
          <div
            key={prop._id}
            className="relative rounded-xl shadow-lg overflow-hidden bg-base-300 hover:shadow-2xl transition flex flex-col"
            data-aos="fade-up"
            data-aos-delay={prop._id.length * 30}
          >
            <figure className="overflow-hidden rounded-t-xl">
              <div className="relative">
                <img
                  src={prop.image}
                  alt={prop.title}
                  className="h-56 w-full object-cover"
                  loading="lazy"
                />

                {prop.status === "sold" && (
                  <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                    SOLD
                  </span>
                )}
              </div>
            </figure>

            <div className="p-5 space-y-2 flex-grow">
              <h3 className="text-2xl font-semibold truncate">{prop.title}</h3>
              <p className="text-indigo-600 font-semibold">{prop.location}</p>

              <div className="flex items-center gap-3 mt-2">
                {prop.agentPhoto ? (
                  <img
                    src={prop.agentPhoto}
                    alt={prop.agentName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="w-10 h-10 text-gray-400" />
                )}
                <span>{prop.agentName}</span>
              </div>

              <p className="mt-3">
                <strong>Status: </strong>
                <span
                  className={`badge ${
                    prop.verificationStatus === "sold"
                      ? "badge-error"
                      : "badge-success"
                  }`}
                >
                  {prop.verificationStatus}
                </span>
              </p>

              <p className="text-lg font-bold text-purple-700">
                ${prop.minPrice} - ${prop.maxPrice}
              </p>
            </div>

            <div className="p-5">
              <Link
                to={`/property/${prop._id}`}
                className="btn btn-primary w-full flex items-center justify-center gap-2 bg-[#00BBA7] hover:bg-[#009d8f] text-white px-6 py-2 rounded-full shadow-lg transition-colors duration-300"
              >
                View Details <MdVisibility size={20} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pb-10">
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

export default AllProperties;