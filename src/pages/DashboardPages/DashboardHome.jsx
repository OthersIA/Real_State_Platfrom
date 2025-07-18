import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { NavLink } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import LoadingFallback from "../../components/shared/LoadingFallback";

const DashboardHome = () => {
    const { user } = useContext(AuthContext);

    // ✅ Get all users
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

    // ✅ Fetch different data based on role
    const { data: properties = [], isLoading: propertiesLoading } = useQuery({
        queryKey: ["properties"],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/properties`);
            return res.data;
        },
        enabled: role === "agent" || role === "admin",
    });

    const { data: wishlist = [], isLoading: wishlistLoading } = useQuery({
        queryKey: ["wishlist", user?.email],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/wishlist?userEmail=${user.email}`);
            return res.data;
        },
        enabled: role === "user",
    });

    const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
        queryKey: ["reviews", user?.email],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/reviews?email=${user.email}`);
            return res.data;
        },
        enabled: role === "user",
    });

    if (usersLoading || propertiesLoading || wishlistLoading || reviewsLoading) {
        return <LoadingFallback />;
    }

    return (
        <section className="p-6 max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
                Welcome, {user?.displayName || "User"}!
            </h2>

            {role === "user" && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="card bg-base-200 p-4">Wishlisted: {wishlist.length}</div>
                        <div className="card bg-base-200 p-4">Reviews Given: {reviews.length}</div>
                    </div>

                    <h3 className="text-xl font-semibold mt-6 mb-2">Quick Actions</h3>
                    <div className="flex gap-4 flex-wrap">
                        <NavLink to="/all-properties" className="btn btn-primary">Browse Properties</NavLink>
                        <NavLink to="/dashboard/profile" className="btn btn-secondary">Update Profile</NavLink>
                    </div>
                </>
            )}

            {(role === "agent" || role=="fraud") && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="card bg-base-200 p-4">Properties Listed: {properties.filter(p => p.agentEmail === user.email).length}</div>
                        <div className="card bg-base-200 p-4">Estimated Earnings: $0</div>
                    </div>

                    <h3 className="text-xl font-semibold mt-6 mb-2">Quick Actions</h3>
                    <div className="flex gap-4 flex-wrap">
                        <NavLink to="/dashboard/add-property" className="btn btn-primary">Add New Property</NavLink>
                        <NavLink to="/dashboard/my-added-properties" className="btn btn-secondary">My Added Properties</NavLink>
                    </div>
                </>
            )}

            {role === "admin" && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="card bg-base-200 p-4">Total Users: {users.length}</div>
                        <div className="card bg-base-200 p-4">Total Properties: {properties.length}</div>
                        <div className="card bg-base-200 p-4">System Revenue: $0</div>
                    </div>

                    <h3 className="text-xl font-semibold mt-6 mb-2">Quick Actions</h3>
                    <div className="flex gap-4 flex-wrap">
                        <NavLink to="/dashboard/manage-users" className="btn btn-primary">Manage Users</NavLink>
                        <NavLink to="/dashboard/manage-properties" className="btn btn-secondary">View All Properties</NavLink>
                    </div>
                </>
            )}
        </section>
    );
};

export default DashboardHome;
