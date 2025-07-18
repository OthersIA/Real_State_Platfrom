import { Outlet } from "react-router";
import Footer from "../components/shared/Footer";
import Navber from "../components/shared/Navber";

const MainLayout = () => {
    return (
        <div className="popins flex flex-col min-h-screen overflow-hidden">
            {/* Fixed Navbar */}
            <div className="">
                <Navber />
            </div>

            {/* Content wrapper with padding top for navbar height */}
            <main className="flex-grow">
                <Outlet />
            </main>

            {/* Footer always at bottom */}
            <footer>
                <Footer />
            </footer>
        </div>
    );
};

export default MainLayout;