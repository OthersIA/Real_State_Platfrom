import { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../../../context/AuthContext";
import LoadingFallback from "../../../components/shared/LoadingFallback";
import { Helmet } from "react-helmet-async";

const MakeOffer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [offerAmount, setOfferAmount] = useState("");
  const [buyingDate, setBuyingDate] = useState("");


  // ✅ Get property details
  const { data: property, isLoading } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/wishlist/${id}`
      );
      return res.data;
    },
  });

  // ✅ Mutation to submit offer
  const makeOffer = useMutation({
    mutationFn: async () => {
      return axios.post(`${import.meta.env.VITE_API_URL}/offers`, {
        wishListId: id,
        propertyId: property?.propertyId,
        propertyTitle: property?.title,
        propertyLocation: property?.location,
        propertyImage: property?.image,
        agentName: property?.agentName,
        agentEmail: property?.agentEmail,
        buyerEmail: user?.email,
        buyerName: user?.displayName,
        offerAmount: parseFloat(offerAmount),
        buyingDate,
        status: "pending",
        createdAt: new Date(),
      });
    },
    onSuccess: () => {
      Swal.fire("Success!", "Your offer is pending.", "success");
      navigate("/dashboard/property-bought");
    },
    onError: () => {
      Swal.fire("Error", "Failed to submit offer.", "error");
    },
  });

  if (isLoading) return <LoadingFallback />;

  if (!property) {
    return (
      <div className="p-6 text-center text-red-500">
        Property not found.
      </div>
    );
  }

  const handleSubmit = () => {
    const min = parseFloat(property?.minPrice) || 0;
    const max = parseFloat(property?.maxPrice) || 0;
    const offer = parseFloat(offerAmount);

    if (!offerAmount || isNaN(offer)) {
      return Swal.fire("Warning", "Please enter a valid offer amount.", "warning");
    }

    if (offer < min || offer > max) {
      return Swal.fire(
        "Invalid Amount",
        `Offer must be between $${min} and $${max}.`,
        "warning"
      );
    }

    if (!buyingDate) {
      return Swal.fire("Warning", "Please select a buying date.", "warning");
    }

    makeOffer.mutate();
  };

  return (
    <section className="container mx-auto md:w-2/3  px-4 py-8 gap-6 min-h-screen">
      <Helmet>
                <title>Make Offer | RealEstate</title>
            </Helmet>
      <div className="bg-base-300 shadow-md rounded-lg p-6 md:p-8 ">
        <h2 className="text-3xl lg:text-4xl text-center font-bold text-[#00BBA7] mb-6">
          Make an Offer
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2">
            <label className="block mb-1 font-semibold">Property Title</label>
            <input
              type="text"
              value={property?.title || ""}
              readOnly
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Property Location</label>
            <input
              type="text"
              value={property?.location || ""}
              readOnly
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Agent Name</label>
            <input
              type="text"
              value={property?.agentName || ""}
              readOnly
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Offer Amount</label>
            <input
              type="number"
              placeholder={`$${property?.minPrice || 0} - $${property?.maxPrice || 0}`}
              value={offerAmount}
              onChange={(e) => setOfferAmount(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Buying Date</label>
            <input
              type="date"
              value={buyingDate}
              onChange={(e) => setBuyingDate(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Buyer Email</label>
            <input
              type="email"
              value={user?.email || ""}
              readOnly
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Buyer Name</label>
            <input
              type="text"
              value={user?.displayName || ""}
              readOnly
              className="input input-bordered w-full"
            />
          </div>

          <button
            className="btn btn-primary w-full col-span-1 md:col-span-2 mt-4"
            onClick={handleSubmit}
            disabled={makeOffer.isLoading}
          >
            {makeOffer.isLoading ? "Submitting..." : "Submit Offer"}
          </button>
        </div>
      </div>
    </section>

  );
};

export default MakeOffer;
