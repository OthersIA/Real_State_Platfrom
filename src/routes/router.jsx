import { createBrowserRouter } from "react-router";
import Home from "../pages/Home";
import MainLayout from "../Layout/MainLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AllProperties from "../pages/AllProperties";
import DashboardHome from "../pages/DashboardPages/DashboardHome";
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
import UpdateProperty from "../pages/DashboardPages/AgentDashboard/UpdateProperty";
import PropertyDetails from "../pages/PropertyDetails";
import MakeOffer from "../pages/DashboardPages/UserDashboard/MakeOffer";
import AdminRoute from "../PrivateRoutes/AdminRoute";
import AgentRoute from "../PrivateRoutes/AgentRoute";
import UserRoute from "../PrivateRoutes/UserRoute";
import Payment from "../pages/DashboardPages/UserDashboard/Payment";
import UserProfile from "../pages/DashboardPages/UserDashboard/UserProfile";
import AdminProfile from "../pages/DashboardPages/AdminDashboard/AdminProfile";
import AgentProfile from "../pages/DashboardPages/AgentDashboard/AgentProfile";
import PaymentHistory from "../pages/DashboardPages/UserDashboard/PaymentHistory";


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
                path: "/property/:id",
                Component: PropertyDetails,
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
                path: 'user-profile',
                element: <UserRoute><UserProfile></UserProfile></UserRoute>,
            },

            // ✅ User only
            {
                path: 'wishlist',
                element: <UserRoute><Wishlist></Wishlist></UserRoute>,
            },
            {
                path: "make-offer/:id",
                Component: MakeOffer,
            },
            {
                path: 'property-bought',
                element: <UserRoute><PropertyBought></PropertyBought></UserRoute>,
            },
            {
                path: 'payment/:wishlistId',
                element: <UserRoute><Payment></Payment></UserRoute>,
            },
            {
                path: 'payments/history/:email',
                element: <UserRoute><PaymentHistory /></UserRoute>,
            },
            {
                path: 'my-reviews',
                element: <UserRoute><MyReviews></MyReviews></UserRoute>,
            },

            // ✅ Agent only
            {
                path: 'agent-profile',
                element: <AgentRoute><AgentProfile></AgentProfile></AgentRoute>,
            },
            {
                path: 'add-property',
                element: <AgentRoute><AddProperty></AddProperty></AgentRoute>,
            },
            {
                path: 'my-added-properties',
                element: <AgentRoute><MyAddedProperties></MyAddedProperties></AgentRoute>
            },
            {
                path: "update-properties/:id",
                element: <AgentRoute><UpdateProperty /></AgentRoute>,
            },
            {
                path: 'my-sold-properties',
                element: <AgentRoute><MySoldProperties></MySoldProperties></AgentRoute>
            },
            {
                path: 'requested-properties',
                element: <AgentRoute><RequestedProperties></RequestedProperties></AgentRoute>,
            },

            // ✅ Admin only
            {
                path: 'manage-properties',
                element: <AdminRoute><ManageProperties></ManageProperties></AdminRoute>,
            },
            {
                path: 'admin-profile',
                element: <AdminRoute><AdminProfile></AdminProfile></AdminRoute>,
            },
            {
                path: 'manage-users',
                element: <AdminRoute><ManageUsers></ManageUsers></AdminRoute>,
            },
            {
                path: 'manage-reviews',
                element: <AdminRoute><ManageReviews></ManageReviews></AdminRoute>,
            },
        ],
    }

]);

export default Router