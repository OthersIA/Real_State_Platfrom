// src/components/ComingSoon.jsx
import React from 'react'; 
import  { useNavigate } from "react-router";

const ComingSoonUpdate = ({
  title = "Coming Soon",
  message = "We're working hard to bring this feature to you soon.",
  showBack = true,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center  min-h-[calc(100vh-64px)] px-4 bg-gradient-to-r from-base-100 to-base-500 dark:from-gray-800 dark:to-gray-900">
      <div className="text-center bg-base-300 dark:bg-gray-800/80 p-10 rounded-2xl shadow-xl backdrop-blur-md">
        <h1 className="text-4xl md:text-5xl font-bold text-[#00BBA7] mb-4">
          🚧 {title}
        </h1>
        <p className="text-lg md:text-xl max-w-xl mx-auto">
          {message}
        </p>

        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="mt-6 inline-flex items-center px-5 py-2.5 text-white bg-[#00BBA7] rounded-full shadow-md transition duration-200"
          >
            ⬅ Back
          </button>
        )}

        <div className="mt-6 animate-bounce text-2xl text-primary">⏳</div>
      </div>
    </div>
  );
};

export default ComingSoonUpdate;
