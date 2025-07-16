import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router";
import { useContext } from "react";
import LoadingFallback from "../components/shared/LoadingFallback";
import { AuthContext } from "../context/AuthContext";

const AllProperties = () => {

     const { user } = useContext(AuthContext);

  // ✅ Load all verified properties
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["all-properties"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/properties`);
      return res.data.filter((p) => p.verificationStatus === "verified");
    },
  });

  if (isLoading) return <LoadingFallback />;

  return (
    <div className=" container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">All Verified Properties</h2>

      {properties.length === 0 && (
        <p className="text-gray-500">No verified properties found yet.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((prop) => (
          <div key={prop._id} className="card bg-base-100 shadow border">
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

              <Link
                to={`/properties/${prop._id}`}
                className="btn btn-sm btn-primary"
              >
                Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProperties;