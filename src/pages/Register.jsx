import { useContext, useState } from "react";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa6";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";
import Lottie from "lottie-react";
import LottieAnimation from "../assets/lotties/register.json";
import axios from "axios";

const Register = () => {
  const { signUp, signInWithGoogle, updateUserProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", imageUrl: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, imageUrl } = form;

    // Password validation
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

    try {
      // 1. Create user in Firebase
      const userCredential = await signUp(email, password);

      // 2. Update Firebase profile with reload
      await updateUserProfile(name, imageUrl || "");

      // 3. Get fresh user from Firebase
      const freshUser = userCredential.user;

      // 4. Send user data to your backend
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

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("image", image);

    const imgUploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_UPLOAD_KEY}`;

    try {
      const res = await axios.post(imgUploadUrl, formData);
      setForm({ ...form, imageUrl: res.data.data.url });
      // Swal.fire({ icon: "success", title: "Image uploaded!", timer: 1200, showConfirmButton: false });
    } catch (err) {
      console.error("Image Upload Error:", err);
      Swal.fire({ icon: "error", title: "Image upload failed!" });
    } finally {
      setUploading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithGoogle();
      const user = result.user;

      const userInfo = {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        role: "user",
        created_at: new Date().toISOString(),
        last_log_in: new Date().toISOString(),
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/users`, userInfo);

      Swal.fire({ icon: "success", title: "Signed up with Google!", timer: 1500, showConfirmButton: false });
      navigate("/");
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: err.message, timer: 1500, showConfirmButton: false });
    }
  };

  return (
    <section className="bg-base-200">
      <div className="container mx-auto">
        <div className="flex items-center justify-center py-10 popins rounded-xl">
          <div className="gap-14 flex flex-col md:flex md:flex-row items-center py-6 px-4 mx-6 lg:p-10 lg:px-20 rounded-2xl">
            <Lottie style={{ width: "300px" }} animationData={LottieAnimation} loop={true} />

            <div className="w-full max-w-sm">
              <div className="border border-primary shadow-2xl card bg-base-100 mx-6 mb-4 lg:mb-0 lg:mx-0">
                <h1 className="poppins p-5 rounded-t-md text-2xl font-bold text-center bg-primary text-primary-content/100">
                  Sign Up
                </h1>

                <div className="card-body">
                  <button onClick={handleGoogleSignup} className="w-full btn rounded-full">
                    <FaGoogle /> <span>Sign Up with Google</span>
                  </button>

                  <div className="divider">OR</div>

                  <form onSubmit={handleSubmit}>
                    <label className="label">Name</label>
                    <input
                      type="text"
                      name="name"
                      onChange={handleChange}
                      className="input input-bordered"
                      placeholder="Name"
                      required
                    />

                    <label className="mt-2 label">Email</label>
                    <input
                      type="email"
                      name="email"
                      onChange={handleChange}
                      className="input input-bordered"
                      placeholder="Email"
                      required
                    />

                    <label className="mt-2 label">Password</label>
                    <div className="relative flex items-center">
                      <input
                        type={passwordVisible ? "text" : "password"}
                        name="password"
                        onChange={handleChange}
                        className="pr-10 input input-bordered"
                        placeholder="Password"
                        required
                      />
                      <span
                        className="absolute text-lg text-gray-500 cursor-pointer right-8"
                        onClick={() => setPasswordVisible((prev) => !prev)}
                      >
                        {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>

                    <label className="mt-2 label">Image (Optional)</label>
                    <input
                      type="file"
                      onChange={handleImageUpload}
                      className="file-input file-input-bordered w-full"
                    />
                    {uploading && <p className="text-green-600 text-sm mt-1">Uploading...</p>}

                    <button type="submit" className="w-full mt-4 btn btn-neutral rounded-full">
                      Sign Up
                    </button>
                  </form>

                  <div className="mt-4 text-center">
                    Already signed up?{" "}
                    <Link className="text-blue-600 underline" to="/login">
                      Login
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

export default Register;
