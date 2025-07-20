import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import { AuthContext } from "../../../context/AuthContext";
import LoadingFallback from "../../../components/shared/LoadingFallback";
import Swal from "sweetalert2";

const AdminProfile = () => {
    const { user, updateUserProfile } = useContext(AuthContext);
    const [previewImage, setPreviewImage] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

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
        let photoURL = userImage;

        if (selectedFile) {
            Swal.fire("Image selected!", "Add your upload logic here.", "info");
        }

        try {
            await updateUserProfile(displayName, photoURL);
            Swal.fire("Success!", "Profile updated!", "success");
            setModalOpen(false);
        } catch (err) {
            console.error("Profile update failed:", err.message);
        }
    };

    return (
        <section className="flex items-center justify-center p-10 fontJakarta">
            <div className="max-w-xl w-full p-6 rounded border border-gray-700  bg-base-300">
                <div className="flex flex-col items-center">
                    <div className="w-28 h-28 rounded-full overflow-hidden  border-4 border-gray-700 mb-4">
                        {userImage || previewImage ? (
                            <img
                                src={previewImage || userImage}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <FaUserCircle className="text-7xl text-gray-500" />
                        )}
                    </div>
                    <h2 className="text-xl font-semibold">{userName}</h2>
                    <p className="">{user?.email}</p>
                    <span className="mt-2 inline-block px-3 py-1 text-xs bg-green-600 rounded-full">
                        {status}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="bg-base-100 p-4 rounded">
                        <p className="text-sm text-gray-400">Role</p>
                        <p>{role}</p>
                    </div>
                    <div className="bg-base-100 p-4 rounded">
                        <p className="text-sm text-gray-400">Status</p>
                        <p className="text-green-500">{status}</p>
                    </div>
                    <div className="bg-base-100 p-4 rounded col-span-1 md:col-span-2">
                        <p className="text-sm text-gray-400">Created At</p>
                        <p>
                            {foundUser?.created_at
                                ? new Date(foundUser.created_at).toLocaleString()
                                : "N/A"}
                        </p>
                    </div>
                    <div className="bg-base-100 p-4 rounded col-span-1 md:col-span-2">
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
                        className="btn btn-primary"
                    >
                        Edit Profile
                    </button>
                </div>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="bg-white text-black rounded p-6 w-full max-w-sm">
                        <h3 className="text-xl font-bold mb-4">Edit Your Profile</h3>
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div>
                                <label className="label">Name</label>
                                <input
                                    defaultValue={userName}
                                    type="text"
                                    name="displayName"
                                    className="w-full input input-bordered"
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">New Profile Photo</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="file-input file-input-bordered w-full"
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
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
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

export default AdminProfile;
