import { useContext, useState } from "react";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";
import Lottie from "lottie-react";
import LottieAnimation from "../assets/lotties/login.json";
import axios from "axios";
import SocialLogin from "../components/shared/SocialLogin";

const Login = () => {
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || "/";

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
      .then(async (userCredential) => {
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
    <section className="fontJakarta bg-base-200">
      <div className="container mx-auto">
        <div className="flex items-center justify-center py-10 popins rounded-xl">
          <div className="gap-16 flex flex-col md:flex-row items-center py-6 px-4 mx-4 lg:p-10 lg:px-20 rounded-2xl">
            <Lottie style={{ width: "300px" }} animationData={LottieAnimation} loop={true} />

            <div className="w-full max-w-sm">
              <div className="border border-primary shadow-2xl card bg-base-100 mx-6 mb-4 lg:mb-0 lg:mx-0">
                <h1 className="poppins p-5 rounded-t-md text-2xl font-bold text-center bg-primary text-primary-content/100">
                  Login
                </h1>

                <div className="card-body">

                  <form onSubmit={handleSubmit}>
                    <label className="label">Email</label>
                    <input
                      type="email"
                      name="email"
                      onChange={handleChange}
                      className="w-full input input-bordered"
                      placeholder="Email"
                      required
                    />

                    <label className="mt-2 label">Password</label>
                    <div className="relative flex items-center">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        onChange={handleChange}
                        className="w-full pr-10 input input-bordered"
                        placeholder="Password"
                        required
                      />
                      <span
                        className="absolute text-lg text-gray-500 cursor-pointer right-3"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>

                    <div className="mt-1 text-right">
                      <Link to="/reset-password" className="text-sm text-blue-500 hover:underline">
                        Forgot Password?
                      </Link>
                    </div>

                    <button type="submit" className="w-full mt-4 btn btn-neutral rounded-full">
                      Login
                    </button>
                  </form>
                  

                  <div className="divider">OR</div>
                  <SocialLogin />

                  <div className="mt-4 text-center">
                    Not signed up?{" "}
                    <Link className="text-blue-600 underline" to="/register">
                      Sign Up
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
