import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import LoadingFallback from "../components/shared/LoadingFallback";
import { FaQuoteLeft, FaQuoteRight, FaStar, FaUserCircle } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const PropertyDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [openReportModal, setOpenReportModal] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 900, easing: "ease-in-out", once: true });
  }, []);

  const { data: property, isLoading } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/properties/${id}`);
      return res.data;
    },
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`);
      return res.data;
    },
  });

  const currentUser = users.find((u) => u.email === user?.email);
  const role = currentUser?.role;

  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", id],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/reviews/${id}`);
      return res.data;
    },
  });

  const { data: isWishlisted, isLoading: isWishlistLoading } = useQuery({
    queryKey: ["wishlist", id, user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/wishlist/check?propertyId=${id}&userEmail=${user.email}`
      );
      return res.data.exists;
    },
  });

  const addToWishlist = useMutation({
    mutationFn: async () => {
      await axios.post(`${import.meta.env.VITE_API_URL}/wishlist`, {
        propertyId: id,
        userEmail: user.email,
      });
    },
    onSuccess: () => {
      Swal.fire("Added to wishlist!", "", "success");
      queryClient.invalidateQueries(["wishlist", id, user?.email]);
    },
    onError: () => {
      Swal.fire("Already in wishlist!", "", "error");
    },
  });

  const addReview = useMutation({
    mutationFn: async () => {
      await axios.post(`${import.meta.env.VITE_API_URL}/reviews`, {
        propertyId: id,
        propertyTitle: property.title,
        userEmail: user.email,
        userName: user.displayName,
        userImage: user.photoURL,
        agentName: property.agentName,
        agentImage: property.agentPhoto,
        comment: reviewText,
        rating,
        createdAt: new Date(),
      });
    },
    onSuccess: () => {
      setReviewText("");
      setRating(0);
      Swal.fire("Review added!", "", "success");
      setShowModal(false);
      queryClient.invalidateQueries(["reviews", id]);
    },
    onError: () => {
      Swal.fire("Failed to add review", "", "error");
    },
  });

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const reporterName = form.reporterName.value;
    const reporterEmail = form.reporterEmail.value;
    const description = form.description.value;

    const reportData = {
      propertyId: property._id,
      propertyTitle: property.title,
      agentName: property.agentName,
      agentEmail: property.agentEmail,
      reporterName,
      reporterEmail,
      description,
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/reports`, reportData);
      Swal.fire("Reported!", "Your report has been submitted.", "success");
      setOpenReportModal(false);
    } catch (error) {
      console.error(error);
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };




  if (isLoading) return <LoadingFallback />;

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
      : null;

  return (
    <section className="container mx-auto py-10 p-6 max-w-6xl">
      <h2
        className="text-3xl md:text-4xl text-center font-extrabold mb-6 border-b-2 border-[#00BBA7] pb-4"
        data-aos="fade-down"
      >
        Propertie Details
      </h2>


      {/* Property Image */}
      <div
        className="w-2/3 md:w-2/4 mx-auto rounded-xl overflow-hidden shadow-lg mb-8"
        data-aos="zoom-in"
      >
        <div className="relative">
          <img
          src={property.image}
          alt={property.title || "Property Image"}
          className="w-full rounded-lg object-cover"
          loading="lazy"
          />

          {property.status === "sold" && (
            <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
              SOLD
            </span>
          )}
        </div>
      </div>

      {/* Property Details Card */}
      <div
        className="bg-base-300 rounded-xl shadow-lg p-8 space-y-4 border border-gray-200 dark:border-gray-700"
        data-aos="fade-up"
      >
        <h2
          className="text-4xl text-center font-extrabold mb-6 text-[#00BBA7]"
          data-aos="fade-down"
        >
          {property.title}
        </h2>
        <p className="text-lg text-center dark:text-gray-200">
          {property.description || "No description provided."}
        </p>
        <p className=" dark:text-gray-300">
          <strong>Location:</strong>{" "}
          <span className="font-semibold text-[#00BBA7]">{property.location}</span>
        </p>
        <p className=" dark:text-gray-300">
          <strong>Agent:</strong>{" "}
          <span className="font-semibold text-[#00BBA7]">{property.agentName} ({property.agentEmail})</span>
        </p>
        <p className=" dark:text-gray-300">
          <strong>Verification:</strong>{" "}
          <span
            className={`font-semibold ${property.verificationStatus === "verified"
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
              }`}
          >
            {property.verificationStatus}
          </span>
        </p>
        <p className=" dark:text-gray-300">
          <strong>Price:</strong>{" "}
          <span className="text-[#00BBA7] font-bold text-lg">
            ${property.minPrice} - ${property.maxPrice}
          </span>
        </p>
        {avgRating && (
          <p className="mt-2 flex items-center gap-2 text-yellow-500 dark:text-yellow-400 font-semibold">
            <strong>Average Rating:</strong> {avgRating}{" "}
            <FaStar className="inline-block" />
          </p>
        )}

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 mt-6">
          <button
            className="btn w-full md:w-auto bg-[#00BBA7] hover:bg-[#009d8f] text-white px-6 py-2 rounded-full shadow-lg transition-colors duration-300 disabled:opacity-50"
            onClick={() => addToWishlist.mutate()}
            disabled={
              !user ||
              isWishlistLoading ||
              addToWishlist.isLoading ||
              isWishlisted ||
              role !== "user" ||
              property.status === "sold"
            }
          >
            {isWishlistLoading
              ? "Checking..."
              : addToWishlist.isLoading
                ? "Adding..."
                : isWishlisted
                  ? "Already in Wishlist"
                  : "Add to Wishlist"}
          </button>

          <button
            className="btn w-full md:w-auto bg-[#00BBA7] hover:bg-[#009d8f] text-white px-6 py-2 rounded-full shadow-lg transition-colors duration-300 disabled:opacity-50"
            onClick={() => setShowModal(true)}
            disabled={
              !user || role !== "user" || property.status === "sold"
            }
          >
            Add a Review
          </button>

          <button
            onClick={() => setOpenReportModal(true)}
            className="btn w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full shadow-lg transition-colors duration-300 disabled:opacity-50"
            disabled={
              !user || role !== "user" || property.status === "sold"
            }
          >
            Report this Property
          </button>
        </div>

      </div>

      {/* Reviews */}
      <div className="mt-12" data-aos="fade-up" data-aos-delay="150">
        <h3 className="text-3xl font-bold mb-6 text-[#00BBA7]">Reviews</h3>
        {reviews.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-lg">No reviews yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {reviews.map((r) => (
              <div
                key={r._id}
                className="relative"
                data-aos="fade-up"
                data-aos-delay={r._id.length * 30}
              >
                {/* User image */}
                <div className="w-16 h-16  absolute -top-8 left-1/2 transform -translate-x-1/2 z-10">
                  {r.userImage ? (
                    <img
                      src={r.userImage}
                      alt={r.userName}
                      className="w-full h-full rounded-full border-4 border-base-100 shadow-lg bg-[#00BBA7] object-cover"
                    />
                  ) : (
                    <FaUserCircle className="w-full h-full text-[#00BBA7]" />
                  )}
                </div>


                <div className="pt-8 flex flex-col items-center gap-4 flex-grow p-6 rounded-xl shadow-md overflow-hidden text-center border border-base-200 bg-base-300 justify-between">
                  <div className="flex flex-col items-center">
                    <p className="font-bold text-[#00BBA7]">
                      {r.userName} (Reviewer)
                    </p>
                    <p className="text-sm text-base-content opacity-60">
                      {new Date(r.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="relative bg-base-200 rounded-lg p-4 text-base-content">
                    <FaQuoteLeft className="absolute top-2 left-2 text-[#00BBA7] text-xl" />
                    <p className="italic px-4">{r.comment}</p>
                    <FaQuoteRight className="absolute bottom-2 right-2 text-[#00BBA7] text-xl" />
                  </div>

                  <div className="flex justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`text-xl ${star <= r.rating
                          ? "text-[#00BBA7]"
                          : "text-base-content opacity-30"
                          }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 bg-opacity-70 flex justify-center items-center z-50"
          data-aos="zoom-in"
        >
          <div className="bg-base-300 p-8 rounded-2xl w-full max-w-md shadow-xl">
            <h4 className="text-2xl font-bold mb-4 text-[#00BBA7]">Write your review</h4>

            <div className="mb-6 flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer text-3xl ${rating >= star ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
                    } hover:text-yellow-500 transition`}
                />
              ))}
            </div>

            <textarea
              className="textarea textarea-bordered w-full resize-none  dark:bg-gray-800  dark:text-gray-100"
              rows="4"
              placeholder="Your review..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />

            <div className="flex justify-end gap-4 mt-6">
              <button
                className="btn btn-ghost text-[#00BBA7] font-semibold"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn bg-[#00BBA7] hover:bg-[#009d8f] text-white font-semibold px-6 disabled:opacity-50"
                disabled={addReview.isLoading}
                onClick={() => {
                  if (!reviewText.trim()) {
                    Swal.fire("Please enter a review.", "", "warning");
                    return;
                  }
                  if (rating < 1) {
                    Swal.fire("Please select a star rating.", "", "warning");
                    return;
                  }
                  addReview.mutate();
                }}
              >
                {addReview.isLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reporting Modal */}
      {openReportModal && (
        <div
          className="fixed inset-0 bg-black/60 bg-opacity-70 flex justify-center items-center z-50"
          data-aos="zoom-in"
        >
          <div className="bg-base-300 p-8 rounded-2xl w-full max-w-md shadow-xl">
            <h4 className="text-2xl font-bold mb-4 text-[#00BBA7]">
              Report this Property
            </h4>

            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="label text-base-content">Your Name</label>
                <input
                  type="text"
                  name="reporterName"
                  defaultValue={user?.displayName || ""}
                  readOnly
                  className="input input-bordered w-full  dark:bg-gray-800 dark:text-gray-100"
                  required
                />
              </div>
              <div>
                <label className="label text-base-content">Your Email</label>
                <input
                  type="email"
                  name="reporterEmail"
                  defaultValue={user?.email}
                  readOnly
                  placeholder="Enter your email"
                  className="input input-bordered w-full  dark:bg-gray-800 dark:text-gray-100"
                  required
                />
              </div>
              <div>
                <label className="label text-base-content">Description</label>
                <textarea
                  name="description"
                  placeholder="Describe the issue..."
                  rows="4"
                  className="textarea textarea-bordered w-full resize-none  dark:bg-gray-800 dark:text-gray-100"
                  required
                ></textarea>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setOpenReportModal(false)}
                  className="btn btn-ghost text-[#00BBA7] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn bg-red-600 hover:bg-red-700 text-white font-semibold px-6"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};

export default PropertyDetails;
