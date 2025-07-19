import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaUserCircle } from "react-icons/fa";
import { AuthContext } from "../../../context/AuthContext";
import LoadingFallback from "../../../components/shared/LoadingFallback";

const UserProfile = () => {
    const { user, updateUserProfile } = useContext(AuthContext);
    const [previewImage, setPreviewImage] = useState(user?.photoURL || "");
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
    const role = foundUser?.role;

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        const displayName = e.target.displayName.value;
        let photoURL = previewImage;

        if (selectedFile) {
            toast.success("New image selected. Add upload logic if needed.");
        }

        try {
            await updateUserProfile(displayName, photoURL);
            toast.success("Profile updated successfully!");
            setModalOpen(false);
        } catch (error) {
            console.error("Profile update failed:", error.message);
        }
    };

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

    return (
        <section className="fontJakarta flex items-center justify-center p-10">
            <div className="w-full max-w-md card bg-base-200">
                <h1 className="poppins pt-6 text-3xl font-bold text-center">My Profile</h1>

                <div className="card-body">
                    <div className="space-y-2">
                        <div className="flex items-center justify-center w-24 h-24 mx-auto overflow-hidden bg-gray-300 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                            {userImage ? (
                                <img
                                    className="object-cover w-full h-full"
                                    src={previewImage || userImage}
                                    alt="Profile"
                                />
                            ) : (
                                <FaUserCircle className="text-6xl text-gray-600" />
                            )}
                        </div>

                        <div className="text-xl font-semibold text-center">{userName}</div>
                        <div className="text-sm text-center opacity-70">{user?.email || "Email not available"}</div>

                        {role && role == "user" && (
                            <div className="text-center">
                                <span className="inline-block bg-primary text-white px-3 py-1 rounded-full text-xs uppercase tracking-wider">
                                    {role}
                                </span>
                            </div>
                        )}

                        <p className="text-xs text-center text-gray-500">
                            Joined:{" "}
                            {foundUser?.created_at
                                ? new Date(foundUser.created_at).toLocaleString()
                                : "N/A"}
                        </p>
                        <p className="text-xs text-center text-gray-500">
                            Last Login{" "}
                            {foundUser?.last_log_in
                                ? new Date(foundUser.last_log_in).toLocaleString()
                                : "N/A"}
                        </p>
                    </div>

                    <div className="mt-6 text-center">
                        <button onClick={() => setModalOpen(true)} className="btn btn-success">
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="bg-white rounded shadow p-6 w-full max-w-sm">
                        <h3 className="text-xl font-bold mb-4">Edit Your Profile</h3>
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div>
                                <label className="label">Name</label>
                                <input
                                    defaultValue={userName}
                                    type="text"
                                    name="displayName"
                                    className="w-full input input-bordered"
                                    placeholder="Name"
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
                                <div className="mt-2">
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        className="w-20 h-20 rounded-full mx-auto"
                                    />
                                </div>
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

export default UserProfile;
