import { Helmet } from 'react-helmet-async';
import { FaLinkedin, FaGithub, FaGlobe } from 'react-icons/fa';


const coreTeam = [
  {
    name: "Ayesha Rahman",
    role: "Customer Success Manager",
    img: "/assets/team1.jpg",
    bio: "Ensures every client feels heard and supported throughout their buying journey.",
  },
  {
    name: "Tariq Hasan",
    role: "Lead UX/UI Designer",
    img: "/assets/team2.jpg",
    bio: "Designs intuitive experiences that make exploring and booking properties effortless.",
  },
  {
    name: "Nusrat Jahan",
    role: "Operations Coordinator",
    img: "/assets/team3.jpg",
    bio: "Keeps daily operations smooth, from listings to agent support.",
  },
];

const AboutUs = () => {
  return (
    <section className="bg-base-100 py-12 px-4 min-h-screen">
      <Helmet>
        <title>About Us | RealEstate</title>
      </Helmet>

      <div className="container mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold pb-4 border-b border-primary inline-block">
            About Us
          </h1>
          <p className="max-w-3xl mx-auto">
            We’re on a mission to redefine how people discover, visit, and secure their dream properties.
            YourRealEstate combines trusted agents, powerful tools, and real connections to make buying and selling property simpler than ever.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid gap-10 md:grid-cols-2">
          <div className="space-y-4" data-aos="fade-right">
            <h2 className="text-xl font-semibold text-[#00BBA7]">🏠 Our Mission</h2>
            <p>
              To empower buyers, sellers, and agents with transparent tools, clear insights, and seamless transactions.
            </p>
          </div>
          <div className="space-y-4" data-aos="fade-left">
            <h2 className="text-xl font-semibold text-[#00BBA7]">🌟 Our Vision</h2>
            <p>
              A world where finding a home or selling one feels easy, transparent, and rewarding for everyone.
            </p>
          </div>
          <div className="space-y-4" data-aos="fade-right">
            <h2 className="text-xl font-semibold text-[#00BBA7]">🤝 Trust & Community</h2>
            <p>
              We believe real estate is more than just transactions — it’s about people, families, and communities.
            </p>
          </div>
          <div className="space-y-4" data-aos="fade-left">
            <h2 className="text-xl font-semibold text-[#00BBA7]">🚀 Innovation Driven</h2>
            <p>
              From smart property search to secure online payments, we’re building solutions that move real estate forward.
            </p>
          </div>
        </div>

        {/* Founder Section */}
        <div
          className="bg-base-300 border border-[#00BBA7] rounded-xl p-8 shadow-md flex flex-col items-center gap-8 max-w-2xl mx-auto"
          data-aos="zoom-in"
        >
          <img
            src="/assets/founder.jpg"
            alt="Yeasin Islam"
            className="w-40 h-40 rounded-full ring ring-[#00BBA7] ring-offset-2 object-cover"
          />
          <div className="text-center space-y-3">
            <h3 className="text-2xl font-bold text-[#00BBA7]">Yeasin Islam</h3>
            <p className="text-sm italic">Founder & Full Stack Developer</p>
            <p>
              Hi, I’m Yeasin — a developer driven by creating real, meaningful solutions for real-world challenges.
              I built this platform to help people find, visit, and secure properties with confidence and ease.
            </p>
            <div className="flex justify-center gap-4 pt-2 text-3xl text-[#00BBA7]">
              <a href="https://www.linkedin.com/in/yeasin-islam75" target="_blank" rel="noopener noreferrer">
                <FaLinkedin />
              </a>
              <a href="https://github.com/yeasin-islam" target="_blank" rel="noopener noreferrer">
                <FaGithub />
              </a>
              <a href="https://yeasinislam08.web.app" target="_blank" rel="noopener noreferrer">
                <FaGlobe />
              </a>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="space-y-6 pt-10">
          <h2 className="text-3xl font-bold text-center text-[#00BBA7]" data-aos="fade-up">
            Meet Our Core Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
            {coreTeam.map((member, i) => (
              <div
                key={i}
                className="rounded-xl bg-base-300 shadow-md p-6 border border-secondary text-center"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-24 h-24 mx-auto rounded-full object-cover ring ring-[#00BBA7] ring-offset-2 mb-4"
                />
                <h4 className="text-xl text-secondary font-semibold">{member.name}</h4>
                <p className="text-sm mb-1">{member.role}</p>
                <p className="text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Line */}
        <div className="text-center pt-10 border-t border-gray-300 text-sm text-gray-500">
          © {new Date().getFullYear()} YourRealEstate — Your trusted property partner.
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
