
import { LuLogIn } from "react-icons/lu";
import { Link } from "react-router";

const Advertisement = ({ properties }) => {
  return (
    <section className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">Featured Advertisements</h2>

      {properties?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {properties.map((property) => (
            <div
              key={property._id}
              className="relative group rounded-lg overflow-hidden"
            >
                <div className="relative bg-white dark:bg-base-100 rounded-lg overflow-hidden h-full flex flex-col">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="h-48 w-full object-cover"
                  />

                  <div className="p-4 flex-grow">
                    <h3 className="text-lg font-bold mb-2">
                      {property.location}
                    </h3>
                    <p className="text-sm mb-1">
                      <strong>Price:</strong> ${property.minPrice} - ${property.maxPrice}
                    </p>
                    <p className="text-sm">
                      <strong>Status:</strong> {property.verificationStatus}
                    </p>
                  </div>

                  {/* ✅ Overlay */}
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                    <Link
                      to={`/property/${property._id}`}
                      className="btn btn-primary"
                    >
                      View Details <LuLogIn />
                    </Link>
                  </div>
                </div>
              </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">
            No Advertised Properties Yet!
          </h2>
        </div>
      )}
    </section>
  );
};

export default Advertisement;
