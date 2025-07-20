import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { NavLink } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import LoadingFallback from "../../components/shared/LoadingFallback";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer,
} from "recharts";

const DashboardHome = () => {
    const { user } = useContext(AuthContext);

    const { data: users = [], isLoading: usersLoading } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`);
            return res.data;
        },
        enabled: !!user?.email,
    });

    const currentUser = users.find((u) => u.email === user?.email);
    const role = currentUser?.role || "user";

    const { data: properties = [], isLoading: propertiesLoading } = useQuery({
        queryKey: ["properties"],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/properties`);
            return res.data;
        },
        enabled: ["agent", "admin"].includes(role),
    });

    const { data: wishlist = [], isLoading: wishlistLoading } = useQuery({
        queryKey: ["wishlist", user?.email],
        queryFn: async () => {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/wishlist?userEmail=${user.email}`
            );
            return res.data;
        },
        enabled: role === "user",
    });

    const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
        queryKey: ["reviews", user?.email],
        queryFn: async () => {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/reviews?email=${user.email}`
            );
            return res.data;
        },
        enabled: role === "user",
    });

    const { data, isLoading } = useQuery({
        queryKey: ["soldProperties", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/sold-properties?agentEmail=${user.email}`
            );
            return res.data;
        },
    });

    const { totalSoldAmount = 0, soldProperties = [] } = data || {};

    if (usersLoading || propertiesLoading || wishlistLoading || reviewsLoading) {
        return <LoadingFallback />;
    }

    if (!currentUser) {
        return (
            <p className="text-center mt-10 text-lg font-semibold text-red-500">
                User not found.
            </p>
        );
    }

    const roleCounts = {
        user: users.filter((u) => u.role === "user").length,
        agent: users.filter((u) => u.role === "agent").length,
        admin: users.filter((u) => u.role === "admin").length,
    };

    const myProperties = properties.filter((p) => p.agentEmail === user.email);

    const COLORS = ["#00BBA7", "#FFBB28", "#FF8042"];

    const rolePieData = [
        { name: "User", value: roleCounts.user },
        { name: "Agent", value: roleCounts.agent },
        { name: "Admin", value: roleCounts.admin },
    ];

    const agentBarData = [
        { name: "Listed", value: myProperties.length },
        { name: "Sold", value: soldProperties.length },
    ];

    const userPieData = [
        { name: "Wishlist", value: wishlist.length },
        { name: "Reviews", value: reviews.length },
    ];

    return (
        <section className="p-6 max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-[#00BBA7]">
                Welcome, {user?.displayName || "User"}!
            </h2>

            {/* ---------- USER DASHBOARD ---------- */}
            {role === "user" && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="card bg-base-200 p-4 border-l-4 border-[#00BBA7]">
                            Wishlisted: {wishlist.length}
                        </div>
                        <div className="card bg-base-200 p-4 border-l-4 border-[#00BBA7]">
                            Reviews Given: {reviews.length}
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold mt-6 mb-2 text-[#00BBA7]">
                        Quick Actions
                    </h3>
                    <div className="flex gap-4 flex-wrap">
                        <NavLink
                            to="/all-properties"
                            className="btn border border-[#00BBA7] text-[#00BBA7] hover:bg-[#00BBA7] hover:text-white"
                        >
                            Browse Properties
                        </NavLink>
                        <NavLink
                            to="/dashboard/user-profile"
                            className="btn border border-[#00BBA7] text-[#00BBA7] hover:bg-[#00BBA7] hover:text-white"
                        >
                            Your Profile
                        </NavLink>
                    </div>

                    <h3 className="text-xl font-semibold mt-6 mb-2 text-[#00BBA7]">
                        Recent Wishlist
                    </h3>
                    {wishlist.length ? (
                        <ul className="list-disc pl-5">
                            {wishlist.slice(0, 3).map((item) => (
                                <li key={item._id}>{item.title}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No wishlist items yet.</p>
                    )}

                    <h3 className="text-xl font-semibold mt-6 mb-2 text-[#00BBA7]">
                        Recent Reviews
                    </h3>
                    {reviews.length ? (
                        <ul className="list-disc pl-5">
                            {reviews.slice(0, 3).map((r) => (
                                <li key={r._id}>{r.comment}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No reviews yet.</p>
                    )}

                    <h3 className="text-xl font-semibold mt-6 mb-2 text-[#00BBA7]">
                        Wishlist vs Reviews
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={userPieData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                            >
                                {userPieData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </>
            )}

            {/* ---------- AGENT DASHBOARD ---------- */}
            {role === "agent" && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="card bg-base-200 p-4 border-l-4 border-[#00BBA7]">
                            Properties Listed: {myProperties.length}
                        </div>
                        <div className="card bg-base-200 p-4 border-l-4 border-[#00BBA7]">
                            Sold Properties: {soldProperties.length}
                        </div>
                        <div className="card bg-base-200 p-4 border-l-4 border-[#00BBA7]">
                            Estimated Earnings: {totalSoldAmount}
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold mt-6 mb-2 text-[#00BBA7]">
                        My Latest Properties
                    </h3>
                    {myProperties.length ? (
                        <ul className="list-disc pl-5">
                            {myProperties.slice(0, 3).map((p) => (
                                <li key={p._id}>{p.title}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No properties listed yet.</p>
                    )}

                    <h3 className="text-xl font-semibold mt-6 mb-2 text-[#00BBA7]">
                        Listed vs Sold
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={agentBarData}>
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#00BBA7" />
                        </BarChart>
                    </ResponsiveContainer>

                    <h3 className="text-xl font-semibold mt-6 mb-2 text-[#00BBA7]">
                        Quick Actions
                    </h3>
                    <div className="flex gap-4 flex-wrap">
                        <NavLink
                            to="/dashboard/add-property"
                            className="btn border border-[#00BBA7] text-[#00BBA7] hover:bg-[#00BBA7] hover:text-white"
                        >
                            Add New Property
                        </NavLink>
                        <NavLink
                            to="/dashboard/my-added-properties"
                            className="btn border border-[#00BBA7] text-[#00BBA7] hover:bg-[#00BBA7] hover:text-white"
                        >
                            My Added Properties
                        </NavLink>
                    </div>
                </>
            )}

            {/* ---------- ADMIN DASHBOARD ---------- */}
            {role === "admin" && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="card bg-base-200 p-4 border-l-4 border-[#00BBA7]">
                            Total Users: {users.length}
                        </div>
                        <div className="card bg-base-200 p-4 border-l-4 border-[#00BBA7]">
                            Roles — User: {roleCounts.user}, Agent: {roleCounts.agent}, Admin: {roleCounts.admin}
                        </div>
                        <div className="card bg-base-200 p-4 border-l-4 border-[#00BBA7]">
                            Total Properties: {properties.length}
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold mt-6 mb-2 text-[#00BBA7]">
                        User Role Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={rolePieData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                            >
                                {rolePieData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>

                    <h3 className="text-xl font-semibold mt-6 mb-2 text-[#00BBA7]">
                        Quick Actions
                    </h3>
                    <div className="flex gap-4 flex-wrap">
                        <NavLink
                            to="/dashboard/manage-users"
                            className="btn border border-[#00BBA7] text-[#00BBA7] hover:bg-[#00BBA7] hover:text-white"
                        >
                            Manage Users
                        </NavLink>
                        <NavLink
                            to="/dashboard/manage-properties"
                            className="btn border border-[#00BBA7] text-[#00BBA7] hover:bg-[#00BBA7] hover:text-white"
                        >
                            View All Properties
                        </NavLink>
                    </div>
                </>
            )}
        </section>
    );
};

export default DashboardHome;
