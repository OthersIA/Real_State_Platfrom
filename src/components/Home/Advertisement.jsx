import { LuLogIn } from "react-icons/lu";
import { Link } from "react-router";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { MdVisibility } from "react-icons/md";

const Advertisement = ({ properties }) => {
  useEffect(() => {
    AOS.init({ duration: 700, easing: "ease-in-out", once: true });
  }, []);

  return (
    <section className="bg-base-100">
      <div className="container mx-auto p-4 py-12">
        <h2
          className="text-3xl md:text-4xl font-bold mb-4 text-center text-[#00BBA7]"
          data-aos="fade-down"
          data-aos-duration="700"
        >
          Featured Advertisements
        </h2>

        <p
          className="text-center max-w-2xl mx-auto mb-12"
          data-aos="fade-up"
          data-aos-duration="700"
          data-aos-delay="100"
        >
          Discover our hand-picked featured properties — from modern apartments to
          luxurious houses. Each listing is verified and updated to help you find
          your dream place with confidence.
        </p>

        {properties?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {properties.map((property, index) => (
              <div
                key={property._id}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="rounded-lg overflow-hidden shadow-md border border-base-200 bg-base-300 flex flex-col"
              >
                <img
                  src={property.image}
                  alt={property.title}
                  className="h-48 w-full object-cover"
                />

                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold mb-2 text-[#00BBA7]">
                    {property.location}
                  </h3>
                  <p className="text-sm mb-1">
                    <span className="font-semibold text-[#00BBA7]">Price:</span>{" "}
                    ${property.minPrice} - ${property.maxPrice}
                  </p>
                  <p className="text-sm mb-4">
                    <span className="font-semibold text-[#00BBA7]">Status:</span>{" "}
                    {property.verificationStatus}
                  </p>

                  <div className="mt-auto">
                    <Link
                      to={`/property/${property._id}`}
                      className="btn btn-primary w-full flex items-center justify-center gap-2 bg-[#00BBA7] hover:bg-[#009d8f] text-white px-6 py-2 rounded-full shadow-lg transition-colors duration-300"
                    >
                      View Details <MdVisibility size={20} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4 text-[#00BBA7]">
              No Advertised Properties Yet!
            </h2>
          </div>
        )}
      </div>
    </section>
  );
};

export default Advertisement;
