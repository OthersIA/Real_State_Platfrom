import { useContext, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import LoadingFallback from "../../../components/shared/LoadingFallback";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaUserCircle } from "react-icons/fa";
import { Helmet } from "react-helmet-async";

const Wishlist = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 600, easing: "ease-out", once: true });
  }, []);

  const { data: wishlist = [], isLoading } = useQuery({
    queryKey: ["wishlist", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/wishlist?email=${user.email}`);
      return res.data;
    },
  });

  const removeItem = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${import.meta.env.VITE_API_URL}/wishlist/${id}`);
    },
    onSuccess: () => {
      Swal.fire("Removed!", "Property removed from wishlist.", "success");
      queryClient.invalidateQueries(["wishlist", user?.email]);
    },
    onError: () => {
      Swal.fire("Error", "Failed to remove.", "error");
    },
  });

  const handleOfferClick = (propertyId) => {
    navigate(`/dashboard/make-offer/${propertyId}`);
  };

  if (isLoading) return <LoadingFallback />;

  return (
    <section className="container mx-auto px-4 py-8 " data-aos="fade-up" >
      <Helmet>
        <title>Wishlists | RealEstate</title>
      </Helmet>
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#00BBA7]">My Wishlist</h2>

      {wishlist.length === 0 ? (
        <p>You haven’t wishlisted any properties yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((property, idx) => (
            <div
              key={property._id}
              data-aos="fade-up"
              data-aos-delay={idx * 100}
              className="p-4 rounded shadow bg-base-300 flex flex-col gap-2 transition-transform hover:scale-[1.02] hover:shadow-lg"
            >
              <div className="relative">
                <img
                  src={property.image}
                  alt="Property"
                  className="w-full h-40 object-cover rounded"
                />
                <span
                  className={`badge absolute top-2 left-2 ${property.status === "sold" ? "badge-error" : "badge-success"
                    }`}
                >
                  {property.status === "sold" ? "Sold" : "Availavle"}
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#00BBA7]">{property.title}</h3>
              <p className="text-sm text-gray-600">{property.location}</p>
              <div className="flex items-center gap-2">
                {property?.agentImage ? (
                  <img
                    src={property.agentImage}
                    alt={property.agentName}
                    className="w-8 h-8 rounded-full object-cover border-2 border-[#00BBA7]"
                  />
                ) : (
                  <FaUserCircle className="w-8 h-8 text-[#00BBA7]" />
                )}
                <span className="text-sm">{property.agentName}</span>
              </div>
              <p>
                <strong>Status:</strong> {property.verificationStatus}
              </p>
              <p>
                <strong>Price:</strong> ${property.minPrice} - ${property.maxPrice}
              </p>

              <div className="flex gap-2 mt-2 flex-wrap">
                <button
                  className="btn btn-xs"
                  style={{
                    backgroundColor: property.status === "sold" ? "#cccccc" : "#00BBA7",
                    borderColor: property.status === "sold" ? "#cccccc" : "#00BBA7",
                    cursor: property.status === "sold" ? "not-allowed" : "pointer",
                  }}
                  onClick={() => handleOfferClick(property._id)}
                  disabled={property.status === "sold"}
                >
                  Make an Offer
                </button>

                <Link
                  to={`/property/${property.propertyId || property._id}`}
                  className="btn btn-xs btn-outline"
                  style={{ borderColor: "#00BBA7", color: "#00BBA7" }}
                >
                  Details
                </Link>

                <button
                  className="btn btn-xs btn-error"
                  onClick={() =>
                    Swal.fire({
                      title: "Remove?",
                      text: "This will remove the property from your wishlist.",
                      icon: "warning",
                      showCancelButton: true,
                    }).then((result) => {
                      if (result.isConfirmed) {
                        removeItem.mutate(property._id);
                      }
                    })
                  }
                >
                  Remove
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Wishlist;
