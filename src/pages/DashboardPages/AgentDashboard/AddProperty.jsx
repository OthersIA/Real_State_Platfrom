import { useContext, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router";

const AddProperty = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        location: "",
        minPrice: "",
        maxPrice: "",
        image: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "image") {
            setForm({ ...form, image: e.target.files[0] });
        } else if (name === "minPrice" || name === "maxPrice") {
            // Ensure price is not negative
            const price = parseFloat(value);
            if (price < 0) {
                return; // Do nothing for negative input
            }
            setForm({ ...form, [name]: value });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const addProperty = useMutation({
        mutationFn: async (data) => {
            // ✅ Upload image to IMGBB
            const imgFormData = new FormData();
            imgFormData.append("image", data.image);

            const imgbbRes = await axios.post(
                `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_UPLOAD_KEY}`,
                imgFormData
            );
            const imageUrl = imgbbRes.data.data.display_url;

            // ✅ Send to backend
            const property = {
                title: data.title,
                location: data.location,
                minPrice: parseFloat(data.minPrice),
                maxPrice: parseFloat(data.maxPrice),
                agentName: user.displayName,
                agentEmail: user.email,
                agentPhoto: user.photoURL,
                image: imageUrl,
            };

            const res = await axios.post(`${import.meta.env.VITE_API_URL}/properties`, property);
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
            return Swal.fire("Prices must be greater than or equal to 0", "", "warning");
        }

        if (parseFloat(form.minPrice) > parseFloat(form.maxPrice)) {
            return Swal.fire("Minimum price cannot be greater than maximum price", "", "warning");
        }

        addProperty.mutate(form);
    };

    return (
        <section className="max-w-xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Add Property</h2>
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
                    <label className="block mb-1">Property Image</label>
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                        required
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
                            placeholder="0"
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
                            placeholder="0"
                            min="0"
                            className="w-full input input-bordered"
                        />
                    </div>
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
                    className="btn btn-primary w-full"
                    disabled={addProperty.isLoading}
                >
                    {addProperty.isLoading ? "Adding..." : "Add Property"}
                </button>
            </form>
        </section>
    );
};

export default AddProperty;
