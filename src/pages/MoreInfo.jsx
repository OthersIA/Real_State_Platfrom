import React from "react";
import { FaBullseye, FaEye, FaHeart } from "react-icons/fa";

const MoreInfo = () => {
    return (
        <section className="py-12 px-4 md:px-10 bg-base-100">
            <div className="container mx-auto">
                <div className="">
                    <h1 className="text-3xl md:text-4xl font-bold text-center text-[#00BBA7] mb-6">
                        More Information
                    </h1>
                    <p className="text-center mb-12 max-w-2xl mx-auto">
                        Learn more about our mission, vision, and core values that drive everything we do.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Mission */}
                        <div className="bg-base-300 shadow-lg border rounded-lg p-6 text-center">
                            <FaBullseye className="text-[#00BBA7] text-4xl mb-4 mx-auto" />
                            <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
                            <p className="">
                                To empower people with the best tools and resources to find their dream property quickly and securely.
                            </p>
                        </div>

                        {/* Vision */}
                        <div className="bg-base-300 shadow-lg border rounded-lg p-6 text-center">
                            <FaEye className="text-[#00BBA7] text-4xl mb-4 mx-auto" />
                            <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
                            <p className="">
                                To be the most trusted and innovative real estate platform that connects buyers, sellers, and agents worldwide.
                            </p>
                        </div>

                        {/* Values */}
                        <div className="bg-base-300 shadow-lg border rounded-lg p-6 text-center">
                            <FaHeart className="text-[#00BBA7] text-4xl mb-4 mx-auto" />
                            <h3 className="text-xl font-semibold mb-2">Our Values</h3>
                            <p className="">
                                We believe in transparency, integrity, and a customer-first approach in everything we do.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MoreInfo;
