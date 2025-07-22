import { useEffect, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router";
import Swal from "sweetalert2";
import { AuthContext } from "../../../context/AuthContext";
import LoadingFallback from "../../../components/shared/LoadingFallback";
import AOS from "aos";
import "aos/dist/aos.css";

const PropertyBought = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  useEffect(() => {
    AOS.init({ duration: 600, easing: "ease-out" });
  }, []);

  // ✅ Get all offers for this user
  const { data: offers = [], isLoading } = useQuery({
    queryKey: ["offers", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/offers?email=${user.email}`
      );
      return res.data;
    },
  });

  // ✅ Delete offer mutation
  const deleteOffer = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${import.meta.env.VITE_API_URL}/offers/${id}`);
    },
    onSuccess: () => {
      Swal.fire("Deleted!", "Offer deleted successfully.", "success");
      queryClient.invalidateQueries(["offers", user?.email]);
    },
    onError: () => {
      Swal.fire("Error", "Failed to delete offer.", "error");
    },
  });

  if (isLoading) return <LoadingFallback />;

  return (
    <section
      data-aos="fade-up"
      className="container mx-auto px-4 py-8 font-sans"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#00BBA7]">My Property Offers</h2>

      {offers.length === 0 ? (
        <p >You haven’t offered on any properties yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div
              key={offer._id}
              className=" rounded shadow bg-base-300 flex flex-col gap-2 p-4 hover:shadow-lg transition-shadow"
            >
              <img
                src={offer.propertyImage || "/placeholder.jpg"}
                alt="Property"
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="text-lg font-bold">{offer.propertyTitle}</h3>
              <p>{offer.propertyLocation}</p>
              <p>Agent: <span className="font-semibold text-[#00BBA7]">{offer.agentName}</span></p>
              <p>Offered Amount: <span className="font-semibold">${offer.offerAmount}</span></p>
              <p>
                Offer Request:{" "}
                <span className={`font-semibold ${offer.status === "accepted" ? "text-green-600" :
                    offer.status === "rejected" ? "text-red-600" :
                      "text-yellow-600"
                  }`}>
                  {offer.status}
                </span>
              </p>
              <div className="flex gap-2 justify-between flex-wrap mt-2">
                <Link
                  to={`/property/${offer.propertyId}`}
                  className="btn btn-sm btn-outline text-[#00BBA7] border-[#00BBA7] hover:bg-[#00BBA7] hover:text-white"
                >
                  Details
                </Link>

                <button
                  onClick={() =>
                    Swal.fire({
                      title: "Delete?",
                      text: "This offer will be deleted permanently.",
                      icon: "warning",
                      showCancelButton: true,
                    }).then((result) => {
                      if (result.isConfirmed) {
                        deleteOffer.mutate(offer._id);
                      }
                    })
                  }
                  className="btn btn-sm btn-error"
                >
                  Delete
                </button>
              </div>

              {offer.status === "pending" && (
                <button
                  className="btn btn-primary btn-sm mt-2"
                  style={{ backgroundColor: "#00BBA7", borderColor: "#00BBA7" }}
                  disabled
                >
                  Waiting for agent's response...
                </button>
              )}

              {offer.status === "rejected" && (
                <button
                  className="btn btn-primary btn-sm mt-2"
                  style={{ backgroundColor: "#00BBA7", borderColor: "#00BBA7" }}
                  disabled
                >
                  Rejected
                </button>
              )}

              {offer.status === "accepted" && !offer.transactionId && (
                <Link
                  to={`/dashboard/payment/${offer._id}`}
                  className="btn btn-primary btn-sm mt-2"
                  style={{ backgroundColor: "#00BBA7", borderColor: "#00BBA7" }}
                >
                  Pay Now
                </Link>
              )}

              {offer.status === "bought" && offer.transactionId && (
                <p
                  className="btn btn-primary btn-xs mt-2 py-4 cursor-default"
                  style={{ backgroundColor: "#00BBA7", borderColor: "#00BBA7" }}
                >
                  Transaction ID: {offer.transactionId}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default PropertyBought;
