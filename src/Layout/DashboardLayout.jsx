import React, { useContext } from "react";
import { NavLink, Outlet } from "react-router";
import {
  FaHome,
  FaHeart,
  FaShoppingCart,
  FaStar,
  FaPlus,
  FaList,
  FaCheckCircle,
  FaClipboardList,
  FaUsersCog,
  FaTasks,
  FaHistory,
  FaBackspace,
} from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import WebLogo from "../components/WebLogo";
import { AuthContext } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingFallback from "../components/shared/LoadingFallback";

const DashboardLayout = () => {
  const { logOut, user } = useContext(AuthContext);

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
  const userImage = foundUser?.photo || user?.photoURL || "/default-avatar.png";
  const role = foundUser?.role;

  // ✅ Closes the drawer on mobile
  const closeDrawer = () => {
    const drawerToggle = document.getElementById("my-drawer-2");
    if (drawerToggle) drawerToggle.checked = false;
  };

  return (
    <section>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          {/* Mobile Navbar */}
          <div className="navbar bg-base-300 w-full lg:hidden">
            <div className="flex-none">
              <label
                htmlFor="my-drawer-2"
                aria-label="open sidebar"
                className="btn btn-square btn-ghost"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-6 h-6 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </label>
            </div>
            <WebLogo />
            <div className="mx-2 flex-1 text-2xl font-bold px-2 lg:hidden text-end">
              Dashboard
            </div>
          </div>

          {/* Main content */}
          <Outlet />
        </div>

        {/* Sidebar */}
        <div className="drawer-side">
          <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>

          <ul className="menu bg-base-300 text-lg text-base-content min-h-full w-80 p-4 flex flex-col">
            <WebLogo />

            <li className="mt-2">
              <NavLink to="/dashboard" onClick={closeDrawer}>
                <FaHome className="inline-block mr-2" />
                Dashboard Home
              </NavLink>
            </li>

            {/* Buyer */}
            {role === "user" && (
              <>
                <li>
                  <NavLink to="/dashboard/wishlist" onClick={closeDrawer}>
                    <FaHeart className="inline-block mr-2" />
                    Wishlist
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/property-bought" onClick={closeDrawer}>
                    <FaShoppingCart className="inline-block mr-2" />
                    Property Bought
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/my-reviews" onClick={closeDrawer}>
                    <FaStar className="inline-block mr-2" />
                    My Reviews
                  </NavLink>
                </li>
                <li>
                  <NavLink to={`/dashboard/payments/history/${user?.email}`} onClick={closeDrawer}>
                    <FaHistory className="inline-block mr-2" />
                    Payment History
                  </NavLink>
                </li>
              </>
            )}

            {/* Agent */}
            {(role === "agent" || role === "fraud") && (
              <>
                <li>
                  <NavLink to="/dashboard/add-property" onClick={closeDrawer}>
                    <FaPlus className="inline-block mr-2" />
                    Add Property
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/my-added-properties" onClick={closeDrawer}>
                    <FaList className="inline-block mr-2" />
                    My Added Properties
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/my-sold-properties" onClick={closeDrawer}>
                    <FaCheckCircle className="inline-block mr-2" />
                    My Sold Properties
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/requested-properties" onClick={closeDrawer}>
                    <FaClipboardList className="inline-block mr-2" />
                    Requested Properties
                  </NavLink>
                </li>
              </>
            )}

            {/* Admin */}
            {role === "admin" && (
              <>
                <li>
                  <NavLink to="/dashboard/manage-properties" onClick={closeDrawer}>
                    <FaTasks className="inline-block mr-2" />
                    Manage Properties
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/manage-users" onClick={closeDrawer}>
                    <FaUsersCog className="inline-block mr-2" />
                    Manage Users
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/manage-reviews" onClick={closeDrawer}>
                    <FaStar className="inline-block mr-2" />
                    Manage Reviews
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/advertise-property" onClick={closeDrawer}>
                    <FaStar className="inline-block mr-2" />
                    Advertise Property
                  </NavLink>
                </li>
              </>
            )}

            <li>
              <NavLink to="/" onClick={closeDrawer}>
                <FaBackspace className="inline-block mr-2" />
                Back To HomePage
              </NavLink>
            </li>

            <div className="flex-grow"></div>
            <li>
              <NavLink
                to={`/dashboard/${role === "admin"
                  ? "admin-profile"
                  : role === "agent" || role === "fraud"
                    ? "agent-profile"
                    : "user-profile"
                  }`}
                onClick={closeDrawer}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden ring ring-[#00BBA7] ring-offset-base-100 ring-offset-2">
                  <img src={userImage} alt="Profile" className="object-cover w-full h-full" />
                </div>
                <div>
                  <p>{userName}</p>
                  <p>Profile</p>
                </div>
              </NavLink>
            </li>
            <li className="mt-4">
              <button
                onClick={() => {
                  logOut();
                  closeDrawer();
                }}
                className="btn w-full bg-[#00BBA7] text-white border-none"
              >
                Log Out <MdLogout className="ml-2" />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default DashboardLayout;
