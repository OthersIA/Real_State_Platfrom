import React from "react";
import { Helmet } from "react-helmet-async";
import { FaEnvelope, FaPhoneAlt, FaHeadset } from "react-icons/fa";

const ContactSupport = () => {
    return (
        <section className="py-12 px-4 md:px-10 bg-base-100">
            <Helmet>
                <title>Contact Support | RealEstate</title>
            </Helmet>
            <div className="container mx-auto ">
                <div className="w-3/5 mx-auto bg-base-300 shadow-lg border rounded-lg p-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#00BBA7] text-center flex items-center justify-center gap-2">
                        <FaHeadset /> Contact Support
                    </h1>
                    <p className="text-center mb-8">
                        Have an issue or a question? Reach out to our support team and we’ll get back to you as soon as possible.
                    </p>

                    {/* Form */}
                    <form className="space-y-6">
                        <div>
                            <label className="block mb-1 font-medium">Your Name</label>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                required
                                className="w-full input input-bordered focus:border-[#00BBA7]"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Your Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                required
                                className="w-full input input-bordered focus:border-[#00BBA7]"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Subject</label>
                            <input
                                type="text"
                                placeholder="Enter subject"
                                required
                                className="w-full input input-bordered focus:border-[#00BBA7]"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Message</label>
                            <textarea
                                rows="5"
                                placeholder="Write your message..."
                                required
                                className="w-full textarea textarea-bordered focus:border-[#00BBA7]"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="btn w-full bg-[#00BBA7] text-white hover:bg-[#009e8f]"
                        >
                            Send Message
                        </button>
                    </form>

                    {/* Contact Details */}
                    <div className="mt-10 text-center text-gray-600">
                        <p className="flex items-center justify-center gap-2">
                            <FaEnvelope className="text-[#00BBA7]" /> support@realstate.com
                        </p>
                        <p className="flex items-center justify-center gap-2 mt-2">
                            <FaPhoneAlt className="text-[#00BBA7]" /> +880 1318-181198
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSupport;
