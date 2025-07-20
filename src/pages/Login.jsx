import { useContext, useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaFacebookF, FaTwitter, FaGoogle } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";
import Lottie from "lottie-react";
import LottieAnimation from "../assets/lotties/login.json";
import axios from "axios";
import SocialLogin from "../components/shared/SocialLogin";
import AOS from "aos";
import "aos/dist/aos.css";

const Login = () => {
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-in-out", once: true });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const updateLastLogin = async (email) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/users/last-login`, {
        email,
        last_log_in: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Failed to update last login", err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signIn(form.email, form.password)
      .then(async () => {
        await updateLastLogin(form.email);
        Swal.fire({
          icon: "success",
          title: "Login successful",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate(from, { replace: true });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: err.message,
          showConfirmButton: false,
          timer: 1500,
        });
      });
  };

  return (
    <div
      className=" min-h-screen flex items-center justify-center bg-cover bg-center text-white font-sans"
      style={{
        backgroundImage:
          "url('https://i.ibb.co/7xQjnTvr/3d-electric-car-building.jpg')",
      }}
    >
      <div className="bg-black/60 bg-opacity-60 w-full h-full flex items-center justify-center min-h-screen">
        <div className="container mx-auto grid md:grid-cols-2 gap-4 p-4 ">
          {/* Left Section */}
          <div className="flex flex-col justify-center px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Welcome <span className="text-white">Back</span> <br />
              <span className="text-teal-400">Login</span> <br /> <span className="text-white">to continue</span>
            </h1>
            <p className="text-gray-300 mb-6">
              Please login to access your account, manage your listings, wishlist and more.
              <a href="#" className="text-teal-400"> Learn more...</a>
            </p>
            <button className="bg-transparent border border-teal-400 text-teal-400 hover:bg-teal-500 hover:text-white px-6 py-2 rounded-full w-fit">
              Contact Support
            </button>
          </div>

          {/* Right Section */}
          <div
            className="rounded-lg p-8 shadow-lg flex flex-col justify-center items-center"
            data-aos="fade-left"
          >
            <h2 className="text-3xl font-semibold mb-4 text-white">LOGIN</h2>
            <form onSubmit={handleSubmit} className="w-full">
              <input
                type="email"
                name="email"
                onChange={handleChange}
                placeholder="Email"
                className="w-full mb-4 p-3 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none"
                required
              />

              <div className="relative mb-6">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none pr-10"
                  required
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg cursor-pointer text-gray-400 hover:text-gray-200"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  role="button"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <div className="text-right mb-4">
                <Link
                  to="/reset-password"
                  className="text-sm text-teal-400 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded"
              >
                LOGIN
              </button>
            </form>

            <div className="divider text-gray-400 my-6">OR</div>

            <SocialLogin />

            <p className="text-gray-400 mt-6 text-md">
              New here?{" "}
              <Link to="/register" className="text-teal-400 hover:underline">
                SIGN UP
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
