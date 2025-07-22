import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";
import LoadingFallback from "../../../components/shared/LoadingFallback";

const AdvertiseProperty = () => {
  const queryClient = useQueryClient();

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

  if (isLoading) return <LoadingFallback />;

  return (
    <section className="px-4 py-8" data-aos="fade-up">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#00BBA7]">
          Advertise Properties
        </h2>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-200 text-base-content">
                <th>Image</th>
                <th>Title</th>
                <th>Price Range</th>
                <th>Agent</th>
                <th>Advertise</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr
                  key={property._id}
                  data-aos="fade-up"
                  className="transition-colors duration-300 hover:bg-[#00bba7]/20 cursor-pointer"
                >
                  <td>
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-20 h-14 object-cover rounded ring ring-[#00BBA7] ring-offset-2"
                    />
                  </td>
                  <td className="font-medium">{property.title}</td>
                  <td>
                    ${property.minPrice} - ${property.maxPrice}
                  </td>
                  <td>{property.agentName}</td>
                  <td>
                    <button
                      onClick={() => handleAddAdvertise(property._id)}
                      className="btn btn-xs border border-[#00BBA7] text-[#00BBA7] hover:bg-[#00BBA7] hover:text-white transition hover:scale-105"
                      disabled={property.advertise}
                    >
                      Advertise
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleRemoveAdvertise(property._id)}
                      className="btn btn-xs border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition hover:scale-105"
                      disabled={!property.advertise}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AdvertiseProperty;
