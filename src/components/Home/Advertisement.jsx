import { LuLogIn } from "react-icons/lu";
import { Link } from "react-router";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const Advertisement = ({ properties }) => {
  useEffect(() => {
    AOS.init({ duration: 700, easing: "ease-in-out" });
  }, []);

  return (
    <section className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-[#00BBA7]">
        Featured Advertisements
      </h2>

      {properties?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {properties.map((property) => (
            <div
              key={property._id}
              data-aos="fade-up"
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
                    className="btn w-full bg-[#00BBA7] text-white border-none"
                  >
                    View Details <LuLogIn className="ml-1" />
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
    </section>
  );
};

export default Advertisement;
