import React from "react";
import { FaCalendarAlt, FaArrowRight } from "react-icons/fa";
import { NavLink } from "react-router";

const mockPosts = [
    {
        id: 1,
        title: "5 Tips for First-Time Home Buyers",
        excerpt:
            "Buying your first home can be overwhelming. Here are 5 expert tips to help you make a smart purchase.",
        date: "July 20, 2025",
        image:
            "https://i.ibb.co/1fSbF77j/HL19-103604-First-Time-Home-Buying-Guide-Live-Text-LP-In-This-Guide-Desktop-2x1-1.png",
    },
    {
        id: 2,
        title: "Why Now is the Best Time to Invest in Real Estate",
        excerpt:
            "Market trends show that 2025 is a promising year for property investment. Learn why you should consider it.",
        date: "July 15, 2025",
        image:
            "https://i.ibb.co/rfGPksw9/why-festive-season-is-the-best-time-to-invest-in-real-estate.png",
    },
    {
        id: 3,
        title: "Top 10 Neighborhoods to Live in Dhaka",
        excerpt:
            "Discover the most desirable areas to buy or rent property in Dhaka this year.",
        date: "July 10, 2025",
        image: "https://i.ibb.co/pjmfJtrT/download.jpg",
    },
];

export default function LatestNews() {
    return (
        <section
            className="bg-base-200 py-12 px-4 md:px-10"
            data-aos="fade-up"
        >
            <div
                className="container mx-auto text-center mb-10"
                data-aos="fade-down"
                data-aos-delay="100"
            >
                <h2 className="text-3xl md:text-4xl font-bold text-[#00BBA7] mb-2">
                    Latest News & Articles
                </h2>
                <p>
                    Stay updated with market trends, tips, and insights for smarter buying and selling.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
                {mockPosts.map((post, index) => (
                    <div
                        key={post.id}
                        className="bg-base-300 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 flex flex-col"
                        data-aos="fade-up"
                        data-aos-delay={200 + index * 100}
                    >
                        <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-6 flex flex-col flex-grow">
                            <h3 className="text-xl font-semibold text-[#00BBA7] mb-2">
                                {post.title}
                            </h3>
                            <div className="flex items-center text-gray-500 text-sm mb-4">
                                <FaCalendarAlt className="mr-2" />
                                {post.date}
                            </div>
                            <p className="mb-4 flex-grow">{post.excerpt}</p>
                            <NavLink
                                to="/update"
                                className="inline-flex items-center text-[#00BBA7] font-semibold hover:underline"
                            >
                                Read More <FaArrowRight className="ml-2" />
                            </NavLink>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
