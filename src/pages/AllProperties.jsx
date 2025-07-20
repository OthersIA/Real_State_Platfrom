import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router"; // ✅ Corrected
import { useContext, useState } from "react";
import LoadingFallback from "../components/shared/LoadingFallback";
import { AuthContext } from "../context/AuthContext";
import { LuLogIn } from "react-icons/lu";

const AllProperties = () => {
  const { user } = useContext(AuthContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["all-properties"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/properties`);
      return res.data.filter((p) => p.verificationStatus === "verified");
    },
  });

  if (isLoading) return <LoadingFallback />;

  const filteredProperties = properties.filter((prop) =>
    prop.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    const priceA = parseFloat(a.minPrice);
    const priceB = parseFloat(b.minPrice);
    return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
  });

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">All Verified Properties</h2>

      <div className="mb-4 flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Search by location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full md:w-1/3"
        />

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="select select-bordered w-full md:w-40"
        >
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>

      {sortedProperties.length === 0 && (
        <p className="text-gray-500">No matching properties found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProperties.map((prop) => (
          <div
            key={prop._id}
            className="relative group card bg-base-100 border shadow hover:shadow-lg transition overflow-hidden rounded-lg"
          >
            <figure>
              <img
                src={prop.image}
                alt="Property"
                className="w-full h-52 object-cover"
              />
            </figure>

            <div className="p-4 space-y-2">
              <h3 className="text-xl font-semibold">{prop.title}</h3>
              <p className="text-gray-600">{prop.location}</p>
              <div className="flex items-center gap-2">
                {prop.agentPhoto ? (
                  <img
                    src={prop.agentPhoto}
                    alt="Agent"
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                    ?
                  </div>
                )}
                <span>{prop.agentName}</span>
              </div>
              <p>
                <strong>Status:</strong>{" "}
                <span className="badge badge-success">
                  {prop.verificationStatus}
                </span>
              </p>
              <p>
                <strong>Price:</strong> ${prop.minPrice} - ${prop.maxPrice}
              </p>
            </div>

            {/* ✅ Hover overlay for Details button */}
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
              <Link
                to={`/property/${prop._id}`}
                className="btn btn-primary"
              >
                View Details <LuLogIn />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProperties;
