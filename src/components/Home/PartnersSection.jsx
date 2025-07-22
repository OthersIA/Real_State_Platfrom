import Marquee from "react-fast-marquee";
import logo1 from "../../assets/brands/amazon.png";
import logo2 from "../../assets/brands/amazon_vector.png";
import logo3 from "../../assets/brands/casio.png";
import logo4 from "../../assets/brands/moonstar.png";
import logo5 from "../../assets/brands/randstad.png";
import logo6 from "../../assets/brands/start.png";
import logo7 from "../../assets/brands/start-people 1.png";

const logos = [logo1, logo2, logo3, logo4, logo5, logo6, logo7];

const PartnersSection = () => {
  return (
    <section
      className="py-14 px-4 md:px-10 bg-base-100"
      data-aos="fade-up"
      data-aos-duration="800"
    >
      <div className="container mx-auto text-center">
        <h2
          className="text-3xl md:text-4xl font-bold text-[#00BBA7] mb-4"
          data-aos="fade-down"
          data-aos-delay="100"
        >
          Trusted by Global Brands & Partners
        </h2>
        <p
          className="max-w-xl mx-auto mb-8"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          We’re proud to work with industry-leading companies who trust us to power their real estate success.
        </p>
      </div>

      <Marquee
        speed={50}
        gradient={false}
        pauseOnHover={true}
        direction="left"
        className="flex items-center"
      >
        {logos.map((logo, index) => (
          <div
            key={index}
            className="mx-8 flex items-center justify-center grayscale hover:grayscale-0 transition duration-500"
          >
            <img
              src={logo}
              alt={`Partner logo ${index + 1}`}
              className="h-12 w-auto object-contain"
            />
          </div>
        ))}
      </Marquee>
    </section>
  );
};

export default PartnersSection;
