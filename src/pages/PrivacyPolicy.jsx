import React from "react";
// import { Helmet } from "react-helmet-async";

const PrivacyPolicy = () => {
  return (
    <section className="container mx-auto py-12 px-4 min-h-screen">
      {/* <Helmet>
        <title>Privacy Policy | YourRealEstate</title>
      </Helmet> */}

      <div className="text-center space-y-6 pb-8">
        <h1 className="text-4xl font-bold border-b border-[#00BBA7] pb-4">
          Privacy Policy
        </h1>
        <p>
          Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information.
        </p>

      </div>
      <div className="space-y-4 leading-relaxed">


        <h2 className="text-xl font-semibold text-[#00BBA7]">1. Information We Collect</h2>
        <p>
          We may collect your name, email, contact details, and property preferences when you register or interact with our site.
        </p>

        <h2 className="text-xl font-semibold text-[#00BBA7]">2. How We Use It</h2>
        <p>
          We use your information to provide services, process transactions, and communicate with you about listings, offers, or updates.
        </p>

        <h2 className="text-xl font-semibold text-[#00BBA7]">3. Data Security</h2>
        <p>
          We use secure servers and encryption to keep your information safe. However, no online service is 100% secure.
        </p>

        <h2 className="text-xl font-semibold text-[#00BBA7]">4. Sharing Information</h2>
        <p>
          We never sell your data. We may share your details with trusted partners (like payment processors) to complete services.
        </p>

        <h2 className="text-xl font-semibold text-[#00BBA7]">5. Cookies</h2>
        <p>
          We use cookies to enhance your experience. You can disable cookies in your browser, but some features may not work properly.
        </p>

        <h2 className="text-xl font-semibold text-[#00BBA7]">6. Changes</h2>
        <p>
          We may update this policy occasionally. We encourage you to review it regularly.
        </p>

        <h2 className="text-xl font-semibold text-[#00BBA7]">7. Contact Us</h2>
        <p>
          For questions about this policy, contact us anytime.
        </p>
      </div>

      <hr className="my-8" />
      <p className="text-center text-sm text-gray-500">
        Last Updated: 7/21/2025
      </p>
    </section>
  );
};

export default PrivacyPolicy;
