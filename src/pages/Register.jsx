import { useContext, useState } from "react";
import { FaEye, FaEyeSlash, FaFacebookF, FaTwitter, FaGoogle, FaUserCircle } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";
import axios from "axios";
import SocialLogin from "../components/shared/SocialLogin";
import { Helmet } from "react-helmet-async";

export default function Register() {
  const { signUp, updateUserProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [imageFile, setImageFile] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = form;

    const upperCase = /[A-Z]/.test(password);
    const lowerCase = /[a-z]/.test(password);
    const validLength = password.length >= 6;

    if (!upperCase) {
      return Swal.fire({ icon: "warning", title: "Password must have at least one uppercase letter!" });
    }
    if (!lowerCase) {
      return Swal.fire({ icon: "warning", title: "Password must have at least one lowercase letter!" });
    }
    if (!validLength) {
      return Swal.fire({ icon: "warning", title: "Password must be at least 6 characters long!" });
    }

    let imageUrl = "";
    if (imageFile) {
      try {
        setUploading(true);
        const formData = new FormData();
        formData.append("image", imageFile);
        const imgUploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_UPLOAD_KEY}`;
        const res = await axios.post(imgUploadUrl, formData);
        imageUrl = res.data.data.url;
      } catch (err) {
        console.error("Image Upload Error:", err);
        Swal.fire({ icon: "error", title: "Image upload failed!" });
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }
    }

    try {
      await signUp(email, password);
      await updateUserProfile(name, imageUrl);

      const userInfo = {
        name,
        email,
        photo: imageUrl || "",
        role: "user",
        created_at: new Date().toISOString(),
        last_log_in: new Date().toISOString(),
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/users`, userInfo);
      Swal.fire({ icon: "success", title: "Sign up successful!", timer: 1500, showConfirmButton: false });
      navigate("/");
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: err.message, timer: 2000, showConfirmButton: false });
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center text-white font-sans"
      style={{
        backgroundImage:
          "url('https://i.ibb.co/ZRBsDKcZ/analog-landscape-city-with-buildings.jpg')",
      }}
    >
      <Helmet>
        <title>Sign Up | RealEstate</title>
      </Helmet>
      <div className="bg-black/60 bg-opacity-60 w-full h-full flex items-center justify-center min-h-screen">
        <div className="w-full container mx-auto grid md:grid-cols-2 gap-4 p-4 ">
          {/* Left Section */}
          <div className="flex flex-col justify-center px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Welcome to<br />
              <span className="text-teal-400">Your Next Journey</span>
            </h1>
            <p className="text-gray-300 max-w-md mb-6">
              Join our real estate platform to buy or sell flats, houses, and properties with confidence.
              Explore verified listings and connect with trusted agents easily.
            </p>
            <NavLink to='/more-info'>
              <button className="bg-transparent border border-teal-400 text-teal-400 hover:bg-teal-500 hover:text-white px-6 py-2 rounded-full w-fit">
                More Info
              </button>
            </NavLink>
          </div>



          {/* Right Section */}
          <div className=" bg-opacity-80 rounded-lg p-8 shadow-lg flex flex-col justify-center items-center">
            <h2 className="text-2xl font-semibold mb-4 text-white">SIGN UP</h2>

            <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-300 flex items-center mx-auto justify-center bg-gray-100 mb-4">
              {imageFile ? (
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Selected preview"
                  className="object-cover w-full h-full"
                />
              ) : (
                <FaUserCircle className="w-14 h-14 text-gray-400" />
              )}
            </div>

            <form onSubmit={handleSubmit} className="w-full">
              <input
                type="text"
                name="name"
                onChange={handleChange}
                placeholder="Name"
                className="w-full mb-4 p-3 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none"
                required
              />

              <input
                type="email"
                name="email"
                onChange={handleChange}
                placeholder="Email"
                className="w-full mb-4 p-3 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none"
                required
              />

              <div className="relative mb-4">
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none pr-10"
                  required
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg cursor-pointer text-gray-400 hover:text-gray-200"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files[0]) setImageFile(e.target.files[0]);
                }}
                className="w-full mb-6 rounded bg-gray-800 text-white border border-gray-700  file-input file-input-bordered"
              />

              <button
                type="submit"
                className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded"
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "SIGN UP"}
              </button>
            </form>

            <div className="divider text-gray-400 my-6">OR</div>

            <SocialLogin />

            <p className="text-gray-400 mt-4 text-sm">
              Already a user? <Link to="/login" className="text-teal-400">LOGIN</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
