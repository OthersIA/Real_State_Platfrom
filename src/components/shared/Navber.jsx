import { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import { MdLogout } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import WebLogo from "../WebLogo";

const Navber = () => {
    const { logOut, user } = useContext(AuthContext);
    console.log(user);


    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    const handleToggle = (e) => {
        if (e.target.checked) {
            setTheme("dark");
        } else {
            setTheme("light");
        }
    };

    useEffect(() => {
        localStorage.setItem("theme", theme);
        document.querySelector("html").setAttribute("data-theme", theme);
    }, [theme]);

    const SunMun = <>
        <label className="swap swap-rotate">
            {/* this hidden checkbox controls the state */}
            <input type="checkbox"
                onChange={handleToggle}
                checked={theme === "light" ? false : true}
                className="theme-controller" value="synthwave" />

            {/* sun icon */}
            <svg
                className="fill-current swap-off h-7 w-7"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24">
                <path
                    d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>

            {/* moon icon */}
            <svg
                className="fill-current swap-on h-7 w-7"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24">
                <path
                    d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
        </label>
    </>

    return (
        <section className="fontJakarta  bg-base-300">
            <div className="container flex justify-between py-2 mx-auto navbar">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            <li>
                                <NavLink className={({ isActive }) =>
                                    isActive ? "text-indigo-500" : ""
                                } to="/">Home</NavLink>
                            </li>

                            <li>
                                <NavLink className={({ isActive }) =>
                                    isActive ? "text-indigo-500" : ""
                                } to="/all-properties">All Properties</NavLink>
                            </li>

                            <li>
                                <NavLink className={({ isActive }) =>
                                    isActive ? "text-indigo-500" : ""
                                } to="/dashboard">Dashboard</NavLink>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <WebLogo></WebLogo>
                    </div>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1 text-lg">
                        <li className="hidden lg:flex">
                            <NavLink className={({ isActive }) =>
                                isActive ? "text-indigo-500" : ""
                            } to="/">Home</NavLink>
                        </li>

                        <li className="hidden lg:flex">
                            <NavLink className={({ isActive }) =>
                                isActive ? "text-indigo-500" : ""
                            } to="/all-properties">All Properties</NavLink>
                        </li>

                        <li className="hidden lg:flex">
                            <NavLink className={({ isActive }) =>
                                isActive ? "text-indigo-500" : ""
                            } to="/dashboard">Dashboard</NavLink>
                        </li>
                    </ul>
                </div>
                <div className="navbar-end">
                    <ul className="flex items-center gap-3 px-1">
                        <li>
                            {SunMun}
                        </li>
                        <div className="relative group">
                            {/* Avatar and trigger */}
                            <div className="flex items-center gap-2 cursor-pointer">
                                <div className="w-8 h-8 overflow-hidden rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    {user?.photoURL ? (
                                        <img
                                            className="object-cover w-full h-full"
                                            src={user?.photoURL}
                                            alt="Profile"
                                        />
                                    ) : (
                                        <FaUserCircle className="w-full h-full " />
                                    )}
                                </div>
                            </div>

                            {/* Hover menu */}
                            <div className="absolute right-0 z-50 invisible w-56 p-4 mt-2 transition duration-200 rounded-md shadow-lg opacity-0 bg-base-100 group-hover:opacity-100 group-hover:visible"
                                onMouseEnter={(e) => e.stopPropagation()}
                                onMouseLeave={(e) => e.stopPropagation()}>
                                <p className="font-semibold">{user?.displayName || "No Name"}</p>
                                <p className="text-xs opacity-70">{user?.email || "No Email"}</p>
                            </div>
                        </div>
                        {user ? (
                            <>
                                <li className="-ml-2">
                                    <button onClick={logOut} className="btn btn-error hidden lg:flex">
                                        Log Out
                                    </button>
                                    <button onClick={logOut} className="btn btn-error lg:hidden">
                                        <MdLogout />
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <NavLink className={({ isActive }) => isActive ? "bg-indigo-700 btn rounded-full" : "btn btn-primary rounded-full"} to="/login">Login</NavLink>
                                </li>
                                <li>
                                    <NavLink className={({ isActive }) => isActive ? "bg-indigo-700 btn rounded-full" : "btn btn-primary rounded-full"} to="/register">SignUp</NavLink>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </section >
    );
};
export default Navber;