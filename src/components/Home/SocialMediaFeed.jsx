import React from "react";
import { FaInstagram, FaHeart, FaComment } from "react-icons/fa";
import { NavLink } from "react-router";

const mockPosts = [
    {
        id: 1,
        image:
            "https://i.ibb.co/V0vxHyT7/analog-landscape-city-with-buildings-1.jpg",
        caption: "Our latest luxury flat just got listed! ✨🏡 #DreamHome",
        likes: 120,
        comments: 14,
    },
    {
        id: 2,
        image:
            "https://i.ibb.co/JwJTVvk6/505411479-1109623204333802-6314011367211794319-n.jpg",
        caption: "Modern apartment with stunning views. 🌆 #CityLiving",
        likes: 98,
        comments: 9,
    },
    {
        id: 3,
        image:
            "https://i.ibb.co/20ML2dSt/521329703-1262724781964740-1167103217564357899-n.jpg",
        caption: "Your dream home is just a click away. 💫 #RealEstate",
        likes: 215,
        comments: 27,
    },
];

export default function SocialMediaFeed() {
    return (
        <section
            className="bg-base-100 py-16 px-4 md:px-10"
            data-aos="fade-up"
            data-aos-duration="800"
        >
            <div
                className="container mx-auto text-center mb-10"
                data-aos="fade-down"
                data-aos-delay="100"
            >
                <h2 className="text-3xl md:text-4xl font-bold mb-2 text-[#00BBA7]">
                    Stay Connected
                </h2>
                <p>
                    Follow us on Instagram for the latest listings, behind-the-scenes, and
                    client stories.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {mockPosts.map((post, index) => (
                    <div
                        key={post.id}
                        className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300"
                        data-aos="fade-up"
                        data-aos-delay={200 + index * 150}
                    >
                        <img
                            src={post.image}
                            alt="Instagram post"
                            className="w-full h-64 object-cover"
                        />
                        <div className="p-4">
                            <p className="mb-3">{post.caption}</p>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <FaHeart className="text-[#E1306C]" /> {post.likes}
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaComment /> {post.comments}
                                </div>
                                <NavLink to="/update"
                                    className="inline-flex items-center gap-1 text-[#00BBA7] hover:underline">
                                    <FaInstagram /> View
                                </NavLink>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
