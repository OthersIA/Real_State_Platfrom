import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../../../context/AuthContext";
import LoadingFallback from "../../../components/shared/LoadingFallback";

const UpdateProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    title: "",
    location: "",
    image: "", // will store URL or File object
    minPrice: "",
    maxPrice: "",
  });

  // Fetch property by ID
  const { data, isLoading, isError } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/properties/${id}`);
      return res.data;
    },
  });

  // When data arrives, fill form state
  useEffect(() => {
    if (data) {
      setForm({
        title: data.title || "",
        location: data.location || "",
        image: data.image || "",
        minPrice: data.minPrice ?? "",
        maxPrice: data.maxPrice ?? "",
      });
    }
  }, [data]);

  // Mutation to update property
  const updateProperty = useMutation({
    mutationFn: async (formData) => {
      let imageUrl = form.image;

      // If image is a File (new upload), upload to imgbb first
      if (formData.image && typeof formData.image !== "string") {
        const imgFormData = new FormData();
        imgFormData.append("image", formData.image);

        const imgbbRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_UPLOAD_KEY}`,
          imgFormData
        );
        imageUrl = imgbbRes.data.data.display_url;
      }

      // Prepare update payload
      const updatePayload = {
        title: formData.title,
        location: formData.location,
        image: imageUrl,
        minPrice: parseFloat(formData.minPrice),
        maxPrice: parseFloat(formData.maxPrice),
        agentPhoto: user.photoURL,
      };

      // Call backend PUT to update property by ID
      return axios.put(`${import.meta.env.VITE_API_URL}/properties/${id}`, updatePayload);
    },
    onSuccess: () => {
      Swal.fire("Success!", "Property updated successfully.", "success");
      navigate("/dashboard/my-added-properties");
    },
    onError: () => {
      Swal.fire("Error", "Failed to update property.", "error");
    },
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setForm({ ...form, image: files[0] }); // set File object
    } else if (name === "minPrice" || name === "maxPrice") {
      const num = parseFloat(value);
      if (num < 0) return; // Prevent negative
      setForm({ ...form, [name]: value });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (parseFloat(form.minPrice) < 0 || parseFloat(form.maxPrice) < 0) {
      return Swal.fire("Prices must be ≥ 0", "", "warning");
    }
    if (parseFloat(form.minPrice) > parseFloat(form.maxPrice)) {
      return Swal.fire("Minimum price cannot be greater than maximum price", "", "warning");
    }

    updateProperty.mutate(form);
  };

  if (isLoading) return <LoadingFallback />;
  if (isError) return <div>Failed to load property data.</div>;

  return (
    <section className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Update Property</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Property Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full input input-bordered"
          />
        </div>

        <div>
          <label className="block mb-1">Property Location</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
            className="w-full input input-bordered"
          />
        </div>

        <div>
          <label className="block mb-1">Current Property Image</label>
          {typeof form.image === "string" && (
            <img
              src={form.image}
              alt="Current property"
              className="w-full max-h-64 object-cover rounded mb-2"
            />
          )}
          <label className="block mb-1">Change Property Image (optional)</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="file-input file-input-bordered w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Minimum Price</label>
            <input
              type="number"
              name="minPrice"
              value={form.minPrice}
              onChange={handleChange}
              required
              min="0"
              className="w-full input input-bordered"
            />
          </div>

          <div>
            <label className="block mb-1">Maximum Price</label>
            <input
              type="number"
              name="maxPrice"
              value={form.maxPrice}
              onChange={handleChange}
              required
              min="0"
              className="w-full input input-bordered"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1">Agent Name</label>
          <input
            type="text"
            value={user?.displayName || "N/A"}
            readOnly
            className="w-full input input-bordered"
          />
        </div>

        <div>
          <label className="block mb-1">Agent Email</label>
          <input
            type="email"
            value={user?.email || "N/A"}
            readOnly
            className="w-full input input-bordered"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={updateProperty.isLoading}
        >
          {updateProperty.isLoading ? "Updating..." : "Update Property"}
        </button>
      </form>
    </section>
  );
};

export default UpdateProperty;
