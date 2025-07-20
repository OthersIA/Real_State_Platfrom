import { useContext, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import LoadingFallback from "../../../components/shared/LoadingFallback";
import AOS from "aos";
import "aos/dist/aos.css";

const Wishlist = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 600, easing: "ease-out" });
  }, []);

  // ✅ Load wishlist
  const { data: wishlist = [], isLoading } = useQuery({
    queryKey: ["wishlist", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/wishlist?email=${user.email}`);
      return res.data;
    },
  });

  // ✅ Remove from wishlist
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
    <section className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-[#00BBA7]">My Wishlist</h2>

      {wishlist.length === 0 ? (
        <p>You haven’t wishlisted any properties yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((property) => (
            <div
              key={property._id}
              data-aos="fade-up"
              className="p-4 rounded shadow bg-base-300 flex flex-col gap-2"
            >
              <img
                src={property.image}
                alt="Property"
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="text-lg font-bold text-[#00BBA7]">{property.title}</h3>
              <p className="text-sm text-gray-600">{property.location}</p>
              <div className="flex items-center gap-2">
                <img
                  src={property.agentImage || "/default-avatar.png"}
                  alt="Agent"
                  className="w-8 h-8 rounded-full"
                />
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
                  style={{ backgroundColor: "#00BBA7", borderColor: "#00BBA7" }}
                  onClick={() => handleOfferClick(property._id)}
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
