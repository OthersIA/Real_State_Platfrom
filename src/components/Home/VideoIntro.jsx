import React from "react";
import { FaPlay } from "react-icons/fa";
import { NavLink } from "react-router";

export default function VideoIntro() {
    return (
        <section className="bg-base-200 py-16 px-4 md:px-10">
            <div className="container w-8/9 mx-auto flex flex-col md:flex-row items-center gap-10">
                {/* Text Content */}
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#00BBA7]">
                        Discover Your Next Home
                    </h2>
                    <p className=" mb-6">
                        Watch our quick explainer video to see how our real estate platform
                        makes buying or selling flats, houses, and properties simple and secure.
                        Join thousands who trust us for their next big move.
                    </p>
                    <NavLink
                        to="/all-properties"
                        className="inline-flex items-center gap-2 bg-[#00BBA7] text-white px-6 py-3 rounded-full hover:bg-teal-600 transition duration-300"
                    >
                        <FaPlay /> Get Started
                    </NavLink>
                </div>

                {/* Embedded Video */}
                <div className="flex-1 w-full max-w-xl">
                    <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-lg border-4 border-[#00BBA7]">
                        <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/gVwV_vnS_rg?si=7zNJDvi3OZ_oOy3H" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                    </div>
                </div>
            </div>
        </section>
    );
}
