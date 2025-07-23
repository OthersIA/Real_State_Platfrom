import { useContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import { AuthContext } from "../../../context/AuthContext";
import LoadingFallback from "../../../components/shared/LoadingFallback";
import Swal from "sweetalert2";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import AOS from "aos";
import "aos/dist/aos.css";

const UserProfile = () => {
  const { user, updateUserProfile } = useContext(AuthContext);
  const [previewImage, setPreviewImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 600, easing: "ease-out" });
  }, []);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`);
      return res.data;
    },
  });

  if (isLoading) return <LoadingFallback />;

  const foundUser = users.find((u) => u.email === user?.email);
  const userName = foundUser?.name || user?.displayName || "User";
  const userImage = foundUser?.image || user?.photoURL;
  const role = foundUser?.role || "User";
  const status = foundUser?.status || "Active";

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const displayName = e.target.displayName.value;
    let photoURL = userImage; // fallback

    try {
      if (selectedFile) {
        const storage = getStorage();
        const storageRef = ref(storage, `profile-images/${user.uid}_${selectedFile.name}`);
        await uploadBytes(storageRef, selectedFile);
        photoURL = await getDownloadURL(storageRef);
      }

      await updateUserProfile(displayName, photoURL);

      await axios.patch(`${import.meta.env.VITE_API_URL}/users/${user.email}`, {
        name: displayName,
        image: photoURL,
      });

      Swal.fire("Success!", "Profile updated!", "success");
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      Swal.fire("Error!", err.message, "error");
    }
  };

  return (
    <section
      data-aos="fade-up"
      className="flex items-center justify-center p-10 fontJakarta"
    >
      <Helmet>
        <title>Your Profile | RealEstate</title>
      </Helmet>
      <div className="max-w-xl w-full p-6 rounded  border  border-[#00BBA7] bg-base-300 shadow-md">
        <div className="flex flex-col items-center">
          <div className="w-28 h-28 rounded-full overflow-hidden  mb-4">
            {userImage || previewImage ? (
              <img
                src={previewImage || userImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <FaUserCircle className="w-full h-full text-[#00BBA7]" />
            )}
          </div>
          <h2 className="text-xl font-semibold text-[#00BBA7]">{userName}</h2>
          <p>{user?.email}</p>
          <span className="mt-2 inline-block px-3 py-1 text-xs bg-green-600 rounded-full">
            {status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-base-100 p-4 rounded">
            <p className="text-sm text-gray-400">Created At</p>
            <p>
              {foundUser?.created_at
                ? new Date(foundUser.created_at).toLocaleString()
                : "N/A"}
            </p>
          </div>
          <div className="bg-base-100 p-4 rounded">
            <p className="text-sm text-gray-400">Last Sign In</p>
            <p>
              {foundUser?.last_log_in
                ? new Date(foundUser.last_log_in).toLocaleString()
                : "N/A"}
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => setModalOpen(true)}
            className="btn border border-[#00BBA7] text-[#00BBA7] hover:bg-[#00BBA7] hover:text-white"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {modalOpen && (
        <div
          data-aos="fade-up"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
        >
          <div className="bg-base-200 rounded p-6 w-full max-w-sm shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-[#00BBA7]">Edit Your Profile</h3>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="label">Name</label>
                <input
                  defaultValue={userName}
                  type="text"
                  name="displayName"
                  className="w-full input input-ed "
                  required
                />
              </div>

              <div>
                <label className="label">New Profile Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input file-input-ed w-full "
                />
              </div>

              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-20 h-20 rounded-full mx-auto"
                />
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-outline"
                  style={{ Color: "#00BBA7", color: "#00BBA7" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn"
                  style={{ backgroundColor: "#00BBA7", Color: "#00BBA7" }}
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default UserProfile;
