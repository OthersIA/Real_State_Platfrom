import { useContext, useState } from "react";
import { FaGoogle, FaGithub, FaEye, FaEyeSlash } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";
import Lottie from "lottie-react";
import LottieAnimation from "../assets/lotties/login.json";

const Login = () => {
  const { signIn, signInWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signIn(form.email, form.password)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Login Succesfuly",
          showConfirmButton: false,
          timer: 1500
        });
        navigate(from);
      })
      .catch(err => {
        Swal.fire({
          icon: "error",
          title: `${err.message}`,
          showConfirmButton: false,
          timer: 1500
        });
      });
  };

  const handleGoogleLogin = () => {
    signInWithGoogle()
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Login with Google!",
          showConfirmButton: false,
          timer: 1500
        });
        navigate(from);
      })
      .catch(err => {
        Swal.fire({
          icon: "error",
          title: `${err.message}`,
          showConfirmButton: false,
          timer: 1500
        });
      });
  };

  return (
    <section className="fontJakarta bg-base-200">
      {/* <Helmet> */}
      {/* <title>
          Login 
        </title> */}
      {/* </Helmet> */}
      <div className="container mx-auto">
        <div className="flex items-center justify-center py-10 popins  rounded-xl">
          <div
            className="gap-16 flex flex-col md:flex md:flex-row  items-center py-6 px-4 mx-4 lg:p-10 lg:px-20 rounded-2xl ">
            <Lottie style={{ width: '300px' }} animationData={LottieAnimation} loop={true} />
            <div className="w-full max-w-sm">
              <div className=" border border-primary shadow-2xl card bg-base-100 mx-6 mb-4 lg:mb-0 lg:mx-0">
                <h1 className="poppins p-5 rounded-t-md text-2xl font-bold text-center bg-primary text-primary-content/100">Login</h1>
                <div className="card-body">
                  <button onClick={handleGoogleLogin} className="w-full  btn rounded-full">
                    <FaGoogle /> <span>Sign in with Google</span>
                  </button>

                  <div className="divider">OR</div>

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
                        onClick={() => setShowPassword(prev => !prev)}
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

                  <div className="mt-4 text-center">
                    Not SignUp?{" "}
                    <Link className="text-blue-600 underline" to="/register">
                      SignUp
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