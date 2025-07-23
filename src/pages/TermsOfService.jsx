import React from "react";
// import { Helmet } from "react-helmet-async";

const TermsOfService = () => {
    return (
        <section className=" container mx-auto py-12 px-4 min-h-screen">
            <Helmet>
                <title>Terms of Service | RealEstate</title>
            </Helmet>
            <div className="text-center space-y-6 pb-8">
                <h1 className="text-4xl font-bold border-b border-[#00BBA7] pb-4 mb-6">
                    Terms of Service
                </h1>

                <p>
                    Welcome to YourRealEstate. By accessing our website and using our services, you agree to comply with and be bound by the following terms.
                </p>
            </div>

            <div className="space-y-4 leading-relaxed">

                <h2 className="text-xl font-semibold text-[#00BBA7]">1. Use of Service</h2>
                <p>
                    You must be at least 18 years old to use our platform. You agree not to misuse the site, misrepresent information, or attempt unauthorized access.
                </p>

                <h2 className="text-xl font-semibold text-[#00BBA7]">2. Listings & Transactions</h2>
                <p>
                    We strive for accurate listings but do not guarantee that all property information is error-free. It’s your responsibility to verify details before making decisions.
                </p>

                <h2 className="text-xl font-semibold text-[#00BBA7]">3. Payments</h2>
                <p>
                    When you make payments through our site, you agree to provide accurate billing information. All transactions are processed securely.
                </p>

                <h2 className="text-xl font-semibold text-[#00BBA7]">4. Account Responsibility</h2>
                <p>
                    You are responsible for maintaining the confidentiality of your account login details and for all activities that occur under your account.
                </p>

                <h2 className="text-xl font-semibold text-[#00BBA7]">5. Changes</h2>
                <p>
                    We may update these Terms occasionally. Continued use of the platform means you accept any new terms.
                </p>

                <h2 className="text-xl font-semibold text-[#00BBA7]">6. Contact</h2>
                <p>
                    If you have questions, please contact our support team anytime.
                </p>
            </div>

            <hr className="my-8" />
            <p className="text-center text-sm text-gray-500">
                Last Updated: 7/21/2025
            </p>
        </section>
    );
};

export default TermsOfService;
