import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
} from "react-icons/hi";
import WebLogo from "../WebLogo";
import { NavLink } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-base-300 px-6 md:px-16 py-10">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          {/* Logo & About */}
          <div>
            <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
              <WebLogo />
            </div>
            <p className="text-md leading-relaxed opacity-90">
              <strong>Real State</strong> is your trusted partner for luxury and lifestyle properties.
              Find your perfect home with expert support.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-lg font-bold mb-4">Quick Links</h2>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/all-properties", label: "All Properties" },
                { href: "/dashboard", label: "Dashboard" },
                { href: "/login", label: "Login / Register" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <NavLink
                    to={href}
                    className="hover:text-accent transition-colors duration-300"
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h2 className="text-lg font-bold mb-4">Contact Us</h2>
            <div className="flex items-start gap-2 mb-2 justify-center md:justify-start">
              <HiOutlinePhone className="mt-1 text-accent" />
              <span>+880 1318 181198</span>
            </div>
            <div className="flex items-start gap-2 mb-2 justify-center md:justify-start">
              <HiOutlineMail className="mt-1 text-accent" />
              <span>support@realstate.com</span>
            </div>
            <div className="flex items-start gap-2 justify-center md:justify-start">
              <HiOutlineLocationMarker className="mt-1 text-accent" />
              <span>Sector-17, Uttara, Dhaka, Bangladesh</span>
            </div>
          </div>

          {/* Follow & Newsletter */}
          <div>
            <h2 className="text-lg font-bold mb-4">Follow Us</h2>
            <div className="flex gap-4 mb-4 text-xl justify-center md:justify-start">
              <a
                href="https://www.facebook.com/yeasin.islam2018"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors duration-300"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://www.linkedin.com/in/yeasin-islam10"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors duration-300"
              >
                <FaLinkedinIn />
              </a>
              <a
                href="https://x.com/yeasin_islam75"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors duration-300"
              >
                <FaTwitter />
              </a>
            </div>
            <p className="mb-2 text-sm opacity-90">Subscribe to our newsletter</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Subscribed!");
              }}
              className="flex flex-col sm:flex-row"
            >
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="p-2 rounded-t-md sm:rounded-t-none sm:rounded-l-md bg-base-100 text-base-content w-full border border-transparent focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="submit"
                className="bg-accent font-semibold px-4 py-2 rounded-b-md sm:rounded-b-none sm:rounded-r-md hover:bg-accent/90 transition duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <hr className="my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between text-md text-gray-600 gap-4">
          <div className="text-center">&copy; {new Date().getFullYear()} Real State. All rights reserved.</div>
          {/* <div className="text-center text-xs text-gray-500">
            Made with ❤️ by Yeasin Islam
          </div> */}
          <ul className="flex flex-wrap items-center justify-center gap-4">
            <li>
              <NavLink
                to="/privacy-policy"
                className="hover:text-accent transition-colors duration-300"
              >
                Privacy Policy
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/terms-of-service"
                className="hover:text-accent transition-colors duration-300"
              >
                Terms of Service
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
