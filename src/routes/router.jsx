import { createBrowserRouter } from "react-router";
import Home from "../pages/Home";
import MainLayout from "../Layout/MainLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import AllProperties from "../pages/AllProperties";


const Router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                index: true,
                path: '/',
                Component: Home
            },
            {
                path: '/dashboard',
                Component: Dashboard,
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
]);

export default Router