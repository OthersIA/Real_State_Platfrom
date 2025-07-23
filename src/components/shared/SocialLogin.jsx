import { useContext } from "react";
import { FaGoogle } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import { useLocation, useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext";

const SocialLogin = () => {
  const { signInWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const updateLastLogin = async (email) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/users/last-login`, {
        email,
        last_log_in: new Date().toISOString(),
      });
    } catch (err) {
      //console.error("Failed to update last login", err);
    }
  };

  const handleGoogleAuth = () => {
    signInWithGoogle()
      .then(async (result) => {
        const user = result.user;

        await axios.put(`${import.meta.env.VITE_API_URL}/users`, {
          name: user.displayName,
          email: user.email,
          image: user.photoURL,
          role: "user",
          created_at: new Date().toISOString(),
        });

        await updateLastLogin(user.email);

        Swal.fire({
          icon: "success",
          title: "Logged in with Google!",
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
    <button
      onClick={handleGoogleAuth}
      className="w-full btn rounded-full border border-[#00BBA7] hover:bg-[#00BBA7] text-[#00BBA7] hover:text-white flex items-center justify-center gap-2"
      aria-label="Continue with Google"
    >
      <FaGoogle size={20} />
      <span>Continue with Google</span>
    </button>
  );
};

export default SocialLogin;
