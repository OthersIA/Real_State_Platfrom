import React from "react";
// import { Helmet } from "react-helmet-async";

const faqs = [
    {
        q: "How do I create an account?",
        a: "Click the 'Sign Up' button in the top right corner and follow the simple steps."
    },
    {
        q: "Is my payment information secure?",
        a: "Yes! We use trusted payment gateways and never store your card details on our servers."
    },
    {
        q: "Can I list my own property?",
        a: "If you're an approved agent, you can add new properties directly from your dashboard."
    },
    {
        q: "How do I book a property viewing?",
        a: "Visit the property page and click 'Request Viewing' to schedule with the agent."
    },
    {
        q: "What happens if my offer is rejected?",
        a: "You can negotiate, make another offer, or browse other listings you may love."
    },
    {
        q: "How can I contact customer support?",
        a: "Use our contact form or live chat — our support team is ready to help!"
    },
    {
        q: "Can I cancel my booking?",
        a: "Booking cancellations depend on the property's terms. Please contact your agent for details."
    },
    {
        q: "Do I need an account to browse properties?",
        a: "No, but you’ll need an account to save favorites, book viewings, or make offers."
    },
    {
        q: "How do I become an agent on this platform?",
        a: "Apply through our Agent Registration page. We'll review and get back to you quickly."
    },
    {
        q: "Is there a fee to use YourRealEstate?",
        a: "Browsing is free. Transaction or agent service fees may apply, clearly shown before payment."
    },
];

const FAQ = () => {
    return (
        <section className="container mx-auto py-12 px-4 min-h-screen">
            {/* <Helmet>
                <title>FAQ | YourRealEstate</title>
            </Helmet> */}

            <h1 className="text-4xl font-bold border-b text-center border-[#00BBA7] pb-4 mb-8">
                Frequently Asked Questions
            </h1>

            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="collapse collapse-plus bg-base-100 border border-base-300"
                        data-aos="fade-up"
                        data-aos-delay={index * 50}
                    >
                        <input type="radio" name="faq-accordion" defaultChecked={index === 0} />
                        <div className="text-xl collapse-title font-semibold text-[#00BBA7]">{faq.q}</div>
                        <div className="collapse-content text-md">{faq.a}</div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FAQ;
