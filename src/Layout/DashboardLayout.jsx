import React, { useContext } from "react";
import { NavLink, Outlet } from "react-router";
import {
    FaHome,
    FaUserEdit,
    FaHeart,
    FaShoppingCart,
    FaStar,
    FaPlus,
    FaList,
    FaCheckCircle,
    FaClipboardList,
    FaUsersCog,
    FaTasks,
} from "react-icons/fa";
import WebLogo from "../components/WebLogo";
import { AuthContext } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingFallback from "../components/shared/LoadingFallback";

const DashboardLayout = () => {
    const { user } = useContext(AuthContext);

    // ✅ Get user’s role from all users collection
    const { data: users = [], isLoading } = useQuery({
        queryKey: ["users"],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`);
            return res.data;
        },
    });

    if (isLoading) {
        return (
            <LoadingFallback />
        );
    }

    const foundUser = users.find((u) => u.email === user?.email);
    const role = foundUser?.role;

    return (
        <section className="">
            <div className="drawer lg:drawer-open">
                <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex flex-col">
                    {/* Navbar */}
                    <div className="navbar bg-base-300 w-full lg:hidden">
                        <div className="flex-none">
                            <label htmlFor="my-drawer-2" aria-label="open sidebar" className="btn btn-square btn-ghost">
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    className="inline-block h-6 w-6 stroke-current">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    ></path>
                                </svg>
                            </label>
                        </div>
                        <div className="mx-2 flex-1 px-2 lg:hidden">Dashboard</div>
                    </div>

                    {/* Page content here */}
                    <Outlet />
                </div>

                <div className="drawer-side">
                    <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                        <WebLogo />
                        {role === "user" && (
                            <>
                                <p>User</p>
                            </>
                        )}
                        {role === "agent" && (
                            <>
                                <p>Agent</p>
                            </>
                        )}
                        {role === "admin" && (
                            <>
                                <p>Admin</p>
                            </>
                        )}
                        <li className="mt-4">
                            <NavLink className={({ isActive }) => (isActive ? "text-cyan-300" : "")} to="/dashboard">
                                <FaHome className="inline-block mr-2" />
                                Dashboard Home
                            </NavLink>
                        </li>

                        {/* ✅ Buyer-only links */}
                        {role === "user" && (
                            <>
                                <li>
                                    <NavLink className={({ isActive }) => (isActive ? "text-indigo-500" : "")} to="/dashboard/profile">
                                        <FaUserEdit className="inline-block mr-2" />
                                        Update Profile
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink className={({ isActive }) => (isActive ? "text-indigo-500" : "")} to="/dashboard/wishlist">
                                        <FaHeart className="inline-block mr-2" />
                                        Wishlist
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink className={({ isActive }) => (isActive ? "text-indigo-500" : "")} to="/dashboard/property-bought">
                                        <FaShoppingCart className="inline-block mr-2" />
                                        Property Bought
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink className={({ isActive }) => (isActive ? "text-indigo-500" : "")} to="/dashboard/my-reviews">
                                        <FaStar className="inline-block mr-2" />
                                        My Reviews
                                    </NavLink>
                                </li>
                            </>
                        )}

                        {/* ✅ Agent-only links */}
                        {(role === "agent" || role == "fraud") && (
                            <>
                                <li>
                                    <NavLink className={({ isActive }) => (isActive ? "text-indigo-500" : "")} to="/dashboard/add-property" >
                                        <FaPlus className="inline-block mr-2" />
                                        Add Property
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink className={({ isActive }) => (isActive ? "text-indigo-500" : "")} to="/dashboard/my-added-properties">
                                        <FaList className="inline-block mr-2" />
                                        My Added Properties
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink className={({ isActive }) => (isActive ? "text-indigo-500" : "")} to="/dashboard/my-sold-properties">
                                        <FaCheckCircle className="inline-block mr-2" />
                                        My Sold Properties
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink className={({ isActive }) => (isActive ? "text-indigo-500" : "")} to="/dashboard/requested-properties">
                                        <FaClipboardList className="inline-block mr-2" />
                                        Requested Properties
                                    </NavLink>
                                </li>
                            </>
                        )}

                        {/* ✅ Admin-only links */}
                        {role === "admin" && (
                            <>
                                <li>
                                    <NavLink className={({ isActive }) => (isActive ? "text-indigo-500" : "")} to="/dashboard/manage-properties">
                                        <FaTasks className="inline-block mr-2" />
                                        Manage Properties
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink className={({ isActive }) => (isActive ? "text-indigo-500" : "")} to="/dashboard/manage-users">
                                        <FaUsersCog className="inline-block mr-2" />
                                        Manage Users
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink className={({ isActive }) => (isActive ? "text-indigo-500" : "")} to="/dashboard/manage-reviews">
                                        <FaStar className="inline-block mr-2" />
                                        Manage Reviews
                                    </NavLink>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default DashboardLayout;
