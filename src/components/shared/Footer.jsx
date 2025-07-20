import { FaFacebookF, FaLinkedinIn, FaTwitter, FaInstagram } from "react-icons/fa";
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from "react-icons/hi";

const Footer = () => {
    return (
        <footer className="bg-blue-500 text-white px-6 md:px-16 py-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Logo & About */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <img src="/logo.png" alt="logo" className="h-10" />
                        <h1 className="text-2xl font-extrabold text-white">PropFinder</h1>
                    </div>
                    <p className="text-sm leading-relaxed">
                        PropFinder is your trusted partner for luxury and lifestyle properties.
                        Find the perfect home with expert support.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h2 className="text-lg font-bold mb-4">Quick Links</h2>
                    <ul className="space-y-2">
                        <li><a href="/" className="hover:underline">Home</a></li>
                        <li><a href="/all-properties" className="hover:underline">All Properties</a></li>
                        <li><a href="/dashboard" className="hover:underline">Dashboard</a></li>
                        <li><a href="/login" className="hover:underline">Login / Register</a></li>
                    </ul>
                </div>

                {/* Contact Us */}
                <div>
                    <h2 className="text-lg font-bold mb-4">Contact Us</h2>
                    <div className="flex items-start gap-2 mb-2">
                        <HiOutlinePhone className="mt-1 text-orange-500" />
                        <span>+880 1318 181198</span>
                    </div>
                    <div className="flex items-start gap-2 mb-2">
                        <HiOutlineMail className="mt-1 text-orange-500" />
                        <span>support@domain.com</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <HiOutlineLocationMarker className="mt-1 text-orange-500" />
                        <span>Sector-17, Uttara, Dhaka, Bangladesh</span>
                    </div>
                </div>

                {/* Follow & Newsletter */}
                <div>
                    <h2 className="text-lg font-bold mb-4">Follow Us</h2>
                    <div className="flex gap-4 mb-4 text-xl">
                        <a href="https://www.facebook.com/yeasin.islam2018" target="_blank" className="hover:text-orange-500"><FaFacebookF /></a>
                        <a href="https://www.linkedin.com/in/yeasin-islam10" className="hover:text-orange-500" target="_blank"><FaLinkedinIn /></a>
                        <a href="https://x.com/yeasin_islam75" target="_blank" className="hover:text-orange-500"><FaTwitter /></a>
                    </div>
                    <p className="mb-2 text-sm">Subscribe to our newsletter</p>
                    <div className="flex">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="p-2 rounded-l-md bg-white text-black w-full"
                        />
                        <button className="bg-orange-500 text-white font-semibold px-4 py-2 rounded-r-md">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
