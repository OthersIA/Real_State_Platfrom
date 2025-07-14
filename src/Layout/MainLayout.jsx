import { Outlet } from "react-router";
import Footer from "../components/Home/Footer";
import Navber from "../components/Home/Navber";

const MainLayout = () => {
    return (
        <div>
            <Navber />
            <Outlet />
            <Footer />
        </div>
    );
};

export default MainLayout;