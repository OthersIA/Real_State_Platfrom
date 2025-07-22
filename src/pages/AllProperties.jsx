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

const AllProperties = () => {
  const { user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // ✅ Added price filter states
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-in-out", once: true });
  }, []);

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["all-properties"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/properties`);
      return res.data.filter((p) => p.verificationStatus === "verified");
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

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    const priceA = parseFloat(a.minPrice);
    const priceB = parseFloat(b.minPrice);
    return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h2
        className="text-center text-3xl md:text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#00BBA7] to-[#009d8f]"
        data-aos="fade-down"
      >
        All Verified Properties
      </h2>

      <p
        className="text-center max-w-2xl mx-auto text-base md:text-lg  mb-8"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        Browse our selection of carefully verified properties. Every listing is
        checked for accuracy to help you buy or sell with complete confidence.
      </p>

      {/* ✅ Search, Sort & New Price Filter */}
      <div
        className="mb-8 flex flex-col md:flex-row flex-wrap gap-4 items-center justify-center"
        data-aos="fade-up"
      >
        <input
          type="text"
          placeholder="Search by location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full md:w-1/3 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
        />

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="select select-bordered w-full md:w-40 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
        >
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>

        {/* ✅ New price inputs */}
        <input
          type="number"
          min="0"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="input input-bordered w-full md:w-32 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
        />

        <input
          type="number"
          min="0"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="input input-bordered w-full md:w-32 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
        />
      </div>

      {sortedProperties.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-lg text-center">
          No matching properties found.
        </p>
      )}

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
        {sortedProperties.map((prop) => (
          <div
            key={prop._id}
            className="relative rounded-xl shadow-lg overflow-hidden dark:border-gray-700 bg-base-300 dark:bg-gray-900 hover:shadow-2xl transition flex flex-col"
            data-aos="fade-up"
            data-aos-delay={prop._id.length * 30}
          >
            <figure className="overflow-hidden rounded-t-xl">
              <img
                src={prop.image}
                alt={prop.title}
                className="w-full h-56 object-cover"
                loading="lazy"
              />
            </figure>

            <div className="p-5 space-y-2 flex-grow">
              <h3 className="text-2xl font-semibold  dark:text-gray-100 truncate">
                {prop.title}
              </h3>
              <p className="text-indigo-600 dark:text-indigo-400 font-semibold">
                {prop.location}
              </p>

              <div className="flex items-center gap-3 mt-2">
                {prop.agentPhoto ? (
                  <img
                    src={prop.agentPhoto}
                    alt={prop.agentName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="w-10 h-10 text-gray-400 dark:text-gray-600" />
                )}
                <span className=" dark:text-gray-300">{prop.agentName}</span>
              </div>

              <p className="mt-3">
                <strong>Status: </strong>
                <span className="badge badge-success">{prop.verificationStatus}</span>
              </p>

              <p className="text-lg font-bold text-purple-700 dark:text-purple-400">
                ${prop.minPrice} - ${prop.maxPrice}
              </p>
            </div>

            {/* Persistent View Details Button at bottom */}
            <div className="p-5 -pt-5">
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
    </div>
  );
};

export default AllProperties;
