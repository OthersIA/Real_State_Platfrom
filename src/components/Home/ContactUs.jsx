import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";

const ContactUs = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        AOS.init({ duration: 700, easing: "ease-in-out", once: true });
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = "Name is required";
        if (!form.email.trim()) {
            newErrors.email = "Email is required";
        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email.trim())
        ) {
            newErrors.email = "Invalid email address";
        }
        if (!form.subject.trim()) newErrors.subject = "Subject is required";
        if (!form.message.trim()) newErrors.message = "Message is required";
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            // Replace this with your API call to send the message
            Swal.fire("Success!", "Your message has been sent.", "success");
            setForm({ name: "", email: "", subject: "", message: "" });
        }
    };

    return (
        <section
            className="bg-base-100"
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-delay="100"
        >
            <div className="container mx-auto px-6 py-12">
                <div
                    className="bg-base-300 w:6/8 md:w-3/5 mx-auto rounded shadow-md my-6 p-6"
                    data-aos="fade-up"
                    data-aos-duration="800"
                    data-aos-delay="200"
                >
                    <h2 className="text-3xl mt-6 text-center md:text-4xl font-bold mb-12 text-[#00BBA7]">
                        Contact Us
                    </h2>
                    <form onSubmit={handleSubmit} noValidate className="space-y-5">
                        {[
                            { label: "Name", name: "name", type: "text", placeholder: "Your full name" },
                            { label: "Email", name: "email", type: "email", placeholder: "you@example.com" },
                            { label: "Subject", name: "subject", type: "text", placeholder: "Subject of your message" },
                        ].map(({ label, name, type, placeholder }) => (
                            <div key={name}>
                                <label className="block mb-1 font-semibold" htmlFor={name}>
                                    {label}
                                </label>
                                <input
                                    id={name}
                                    name={name}
                                    type={type}
                                    value={form[name]}
                                    onChange={handleChange}
                                    className={`input input-bordered w-full ${errors[name] ? "border-red-500" : ""
                                        }`}
                                    placeholder={placeholder}
                                />
                                {errors[name] && (
                                    <p className="text-red-500 mt-1 text-sm">{errors[name]}</p>
                                )}
                            </div>
                        ))}

                        <div>
                            <label className="block mb-1 font-semibold" htmlFor="message">
                                Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                rows="5"
                                value={form.message}
                                onChange={handleChange}
                                className={`textarea textarea-bordered w-full ${errors.message ? "border-red-500" : ""
                                    }`}
                                placeholder="Write your message here..."
                            />
                            {errors.message && (
                                <p className="text-red-500 mt-1 text-sm">{errors.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn w-full bg-[#00BBA7] border-[#00BBA7] text-white hover:bg-[#009e8f]"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ContactUs;
