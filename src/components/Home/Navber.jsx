import { NavLink } from "react-router";

const Navber = () => {
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
                        <NavLink to="/">
                            <div className="flex items-center justify-start">
                                <p className="text-4xl lg:flex hidden items-center font-[1000] text-primary ">PropFinder</p>
                            </div>
                        </NavLink>
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
                            <NavLink className={({ isActive }) => isActive ? "bg-indigo-700 btn rounded-full" : "btn btn-primary rounded-full"} to="/login">Login</NavLink>
                        </li>
                        <li>
                            <NavLink className={({ isActive }) => isActive ? "bg-indigo-700 btn rounded-full" : "btn btn-primary rounded-full"} to="/register">SignUp</NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    );
};
export default Navber;