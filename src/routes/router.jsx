import { createBrowserRouter } from "react-router";
import Home from "../pages/Home";
import MainLayout from "../Layout/MainLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AllProperties from "../pages/AllProperties";
import DashboardHome from "../pages/DashboardPages/DashboardHome";
import UpdateProfile from "../pages/DashboardPages/UpdateProfile";
import DashboardLayout from "../Layout/DashboardLayout";
import AddProperty from "../pages/DashboardPages/AgentDashboard/AddProperty";
import Wishlist from "../pages/DashboardPages/UserDashboard/Wishlist";
import PropertyBought from "../pages/DashboardPages/UserDashboard/PropertyBought";
import MyReviews from "../pages/DashboardPages/UserDashboard/MyReviews";
import MyAddedProperties from "../pages/DashboardPages/AgentDashboard/MyAddedProperties";
import MySoldProperties from "../pages/DashboardPages/AgentDashboard/MySoldProperties";
import RequestedProperties from "../pages/DashboardPages/AgentDashboard/RequestedProperties";
import ManageProperties from "../pages/DashboardPages/AdminDashboard/ManageProperties";
import ManageUsers from "../pages/DashboardPages/AdminDashboard/ManageUsers";
import ManageReviews from "../pages/DashboardPages/AdminDashboard/ManageReviews";
import ErrorPage from "../pages/ErrorPage";
import Forbidden from "../pages/Forbidden/Forbidden";
import PrivateRoute from "../PrivateRoutes/PrivateRoute";


const Router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        errorElement: <ErrorPage></ErrorPage>,
        children: [
            {
                index: true,
                path: '/',
                Component: Home
            },
            {
                path: '/forbidden',
                Component: Forbidden,
            },
            {
                path: '/all-properties',
                Component: AllProperties,
            },
            {
                path: '/login',
                Component: Login,
            },
            {
                path: '/register',
                Component: Register,
            },

        ]
    },
    {
        path: '/dashboard',
        element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
        errorElement: <ErrorPage></ErrorPage>,
        children: [
            // Common dashboard home
            {
                index: true,
                Component: DashboardHome,
            },
            {
                path: 'profile',
                Component: UpdateProfile,
            },

            // ✅ User only
            {
                path: 'wishlist',
                Component: Wishlist,
            },
            {
                path: 'property-bought',
                Component: PropertyBought,
            },
            {
                path: 'my-reviews',
                Component: MyReviews,
            },

            // ✅ Agent only
            {
                path: 'add-property',
                Component: AddProperty,
            },
            {
                path: 'my-added-properties',
                Component: MyAddedProperties,
            },
            {
                path: 'my-sold-properties',
                Component: MySoldProperties,
            },
            {
                path: 'requested-properties',
                Component: RequestedProperties,
            },

            // ✅ Admin only
            {
                path: 'manage-properties',
                Component: ManageProperties,
            },
            {
                path: 'manage-users',
                Component: ManageUsers,
            },
            {
                path: 'manage-reviews',
                Component: ManageReviews,
            },
        ],
    }

]);

export default Router