import { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import { MdLogout } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import WebLogo from "../WebLogo";

const Navber = () => {
  const { logOut, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const handleToggle = (e) => {
    setTheme(e.target.checked ? "dark" : "light");
  };

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const SunMoonToggle = (
    <label className="swap swap-rotate cursor-pointer" aria-label="Toggle theme">
      <input
        type="checkbox"
        onChange={handleToggle}
        checked={theme === "dark"}
        aria-checked={theme === "dark"}
      />
      {/* Sun Icon */}
      <svg
        className="swap-off fill-current w-7 h-7"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
      </svg>
      {/* Moon Icon */}
      <svg
        className="swap-on fill-current w-7 h-7"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
      </svg>
    </label>
  );

  const handleNavClick = (to) => {
    navigate(to);
    document.getElementById("my-drawer").checked = false;
  };

  return (
    <section className="fontJakarta bg-base-300">
      <div className="navbar container mx-auto">
        {/* Mobile drawer toggle */}
        <div className="navbar-start">
          <div className="flex items-center md:gap-2 ">
            <label htmlFor="my-drawer" className="btn btn-ghost lg:hidden ">
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
            <WebLogo />
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal space-x-2 text-lg">
            {[
              { to: "/", label: "Home" },
              { to: "/all-properties", label: "All Properties" },
              { to: "/dashboard", label: "Dashboard", auth: true },
              { to: "/about-us", label: "About Us" },
              { to: "/faq", label: "FAQ" },
            ]
              .filter(link => !link.auth || user)
              .map(link => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      isActive ? "bg-[#00BBA7] text-white rounded-full px-3 py-1" : ""
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
          </ul>
        </div>

        {/* End */}
        <div className="navbar-end">
          <ul className="flex items-center gap-3 px-1">
            <li>{SunMoonToggle}</li>
            <li className="relative group">
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-8 h-8 overflow-hidden rounded-full ring ring-[#00BBA7] ring-offset-base-100 ring-offset-2">
                  {user?.photoURL ? (
                    <img className="object-cover w-full h-full" src={user.photoURL} alt="Profile" />
                  ) : (
                    <FaUserCircle className="w-full h-full text-[#00BBA7]" />
                  )}
                </div>
              </div>
              <div className="absolute right-0 z-50 invisible w-56 p-4 mt-2 rounded-md shadow-lg opacity-0 bg-base-100 group-hover:visible group-hover:opacity-100 transition duration-200">
                <p className="font-semibold">{user?.displayName || "No Name"}</p>
                <p className="text-xs opacity-70">{user?.email || "No Email"}</p>
              </div>
            </li>
            {user ? (
              <li>
                <button onClick={logOut} className="btn bg-red-500 text-white">
                  <span className="hidden lg:inline">Log Out</span>
                  <MdLogout className="lg:hidden" />
                </button>
              </li>
            ) : (
              <li>
                <NavLink className="btn bg-[#00BBA7] text-white rounded-full" to="/login">
                  Login
                </NavLink>
              </li>
            )}
          </ul>
        </div>

        {/* Drawer */}
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-side lg:hidden z-50">
          <label htmlFor="my-drawer" className="drawer-overlay"></label>

          <ul className="menu p-4 w-60 min-h-full bg-base-100">
            <WebLogo />
            {[
              { to: "/", label: "Home" },
              { to: "/all-properties", label: "All Properties" },
              { to: "/dashboard", label: "Dashboard", auth: true },
              { to: "/about-us", label: "About Us" },
              { to: "/faq", label: "FAQ" },
            ]
              .filter(link => !link.auth || user)
              .map(link => (
                <li key={link.to}>
                  <button
                    onClick={() => handleNavClick(link.to)}
                    className={({ isActive }) =>
                      isActive ? "bg-[#00BBA7] text-white rounded-full px-3 py-1" : ""
                    }
                  >
                    {link.label}
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Navber;
