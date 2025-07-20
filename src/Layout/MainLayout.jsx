import { Outlet } from "react-router";
import Footer from "../components/shared/Footer";
import Navber from "../components/shared/Navber";

const MainLayout = () => {
  return (
    <div className="poppins flex flex-col min-h-screen overflow-hidden">
      {/* Fixed Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <Navber />
      </header>

      {/* Main content with top padding to offset the fixed navbar */}
      <main className="flex-grow pt-20">
        <Outlet />
      </main>

      {/* Footer always pinned at the bottom */}
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default MainLayout;
