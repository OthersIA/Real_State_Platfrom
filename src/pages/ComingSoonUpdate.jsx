import React from "react";
import { FaTools, FaBell } from "react-icons/fa";

export default function ComingSoonUpdate() {
  return (
    <div
      className="flex items-center justify-center bg-gradient-to-r from-[#00BBA7] to-[#00796B] px-4  text-center"
    >
      <div className="max-w-lg bg-base-300 backdrop-blur-md my-11 p-10 rounded-lg shadow-lg">
        <FaTools className="text-5xl mx-auto mb-4 animate-spin-slow" />

        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Something Awesome is Coming!
        </h1>

        <p className="mb-6 text-lg">
          We’re working hard to bring you a new feature or update. Please check back soon!
        </p>

        <form className="flex flex-col md:flex-row justify-center items-center">
          <input
            type="email"
            placeholder="Get notified"
             className="p-2 rounded-t-md sm:rounded-t-none sm:rounded-l-md bg-base-100 text-base-content border border-transparent focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            type="submit"
            className="border border-[#00BBA7]  px-4 py-2 rounded-r bg-[#00BBA7] text-black hover:text-white transition"
          >
            <FaBell className="inline mr-2" /> Notify Me
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-200">
          Thank you for your patience and support!
        </p>
      </div>
    </div>
  );
}
