import { useContext, useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router";
import AOS from "aos";
import "aos/dist/aos.css";

const AddProperty = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    location: "",
    minPrice: "",
    maxPrice: "",
    image: null,
    description: "",
  });

  // New state for image preview URL
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-in-out", once: true });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "image") {
      const file = e.target.files[0];
      setForm({ ...form, image: file });

      // Update preview URL
      if (file) {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setPreviewUrl(null);
      }
    } else if (name === "minPrice" || name === "maxPrice") {
      const price = parseFloat(value);
      if (price < 0) return;
      setForm({ ...form, [name]: value });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const addProperty = useMutation({
    mutationFn: async (data) => {
      const imgFormData = new FormData();
      imgFormData.append("image", data.image);

      const imgbbRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_UPLOAD_KEY}`,
        imgFormData
      );
      const imageUrl = imgbbRes.data.data.display_url;

      const property = {
        title: data.title,
        location: data.location,
        minPrice: parseFloat(data.minPrice),
        maxPrice: parseFloat(data.maxPrice),
        description: data.description,
        agentName: user.displayName,
        agentEmail: user.email,
        agentPhoto: user.photoURL,
        image: imageUrl,
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/properties`,
        property
      );
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Success!", "Property added successfully.", "success");
      navigate("/dashboard/my-added-properties");
    },
    onError: () => {
      Swal.fire("Failed to add property", "", "error");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.image) {
      return Swal.fire("Please select an image", "", "warning");
    }

    if (parseFloat(form.minPrice) < 0 || parseFloat(form.maxPrice) < 0) {
      return Swal.fire(
        "Prices must be greater than or equal to 0",
        "",
        "warning"
      );
    }

    if (parseFloat(form.minPrice) > parseFloat(form.maxPrice)) {
      return Swal.fire(
        "Minimum price cannot be greater than maximum price",
        "",
        "warning"
      );
    }

    addProperty.mutate(form);
  };

  return (
    <section
      className="container mx-auto p-4"
      data-aos="fade-up"
    >
      <div className="p-10 max-w-2xl mx-auto lg:max-w-3xl bg-base-300 rounded shadow-md space-y-6">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-[#00BBA7] text-center">
          Add Property
        </h2>
        <form data-aos="fade-up" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Property Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full input input-bordered focus:border-[#00BBA7]"
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
              className="w-full input input-bordered focus:border-[#00BBA7]"
            />
          </div>



          {/* Image preview */}
          <div className="mt-2 text-center">
            {previewUrl ? (
              <>
                <div className="mt-2 text-center">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-48 h-auto rounded shadow-md mx-auto"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Selected image preview
                </p>
              </>
            ) : (
              <>
                <div className="mt-2 text-center">
                  <img
                    src="http://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE3CETL_OertJKScoHfblxs6CBrKGVCmVESw&s"
                    alt="Dummy Preview"
                    className="w-48 h-auto rounded shadow-md mx-auto"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  No image selected yet
                </p>
              </>
            )}
          </div>

          <div>
            <label className="block mb-1">Property Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              required
              className="file-input file-input-bordered w-full focus:border-[#00BBA7]"
            />
          </div>


          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block mb-1">Minimum Price</label>
              <input
                type="number"
                name="minPrice"
                value={form.minPrice}
                onChange={handleChange}
                required
                placeholder="0"
                min="0"
                className="w-full input input-bordered focus:border-[#00BBA7]"
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
                placeholder="0"
                min="0"
                className="w-full input input-bordered focus:border-[#00BBA7]"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Property Description</label>
            <textarea
              className="textarea textarea-bordered w-full focus:border-[#00BBA7]"
              rows="3"
              placeholder="Description..."
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1">Agent Name</label>
            <input
              type="text"
              value={user.displayName || "N/A"}
              readOnly
              className="w-full input input-bordered"
            />
          </div>

          <div>
            <label className="block mb-1">Agent Email</label>
            <input
              type="email"
              value={user.email || "N/A"}
              readOnly
              className="w-full input input-bordered"
            />
          </div>

          <button
            type="submit"
            className="btn w-full border border-[#00BBA7] text-[#00BBA7] hover:bg-[#00BBA7] hover:text-white"
            disabled={addProperty.isLoading}
          >
            {addProperty.isLoading ? "Adding..." : "Add Property"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddProperty;
