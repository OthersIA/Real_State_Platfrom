import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Advertisement from "../components/Home/Advertisement";
import Hero from "../components/Home/Hero";
import LatestUserReviews from "../components/Home/LatestUserReviews";
import LoadingFallback from "../components/shared/LoadingFallback";
import ContactUs from "../components/Home/ContactUs";
import HowItWorksMarquee from "../components/Home/HowItWorksCarousel";
import VideoIntro from "../components/Home/VideoIntro";
import SocialMediaFeed from "../components/Home/SocialMediaFeed";
import LatestNews from "../components/Home/LatestNews";
import PartnersSection from "../components/Home/PartnersSection";
import MapSection from "../components/Home/MapSection";
import Banner from "../components/Home/Banner";

const Home = () => {
  const { data: properties = [], isLoading: isLoadingProperties } = useQuery({
    queryKey: ["advertised-properties"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/property/advertised`);
      return res.data.slice(0, 4);
    },
  });

  const { data: reviews = [], isLoading: isLoadingReviews } = useQuery({
    queryKey: ["latest-reviews"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/all-reviews`);
      return res.data.slice(0, 3);
    },
  });

  const isLoading = isLoadingProperties || isLoadingReviews;

  if (isLoading) return <LoadingFallback />;

  return (
    <section>
      <Banner></Banner>
      {/* <Hero /> */}
      <Advertisement properties={properties} />
      <LatestUserReviews reviews={reviews} />
      <HowItWorksMarquee></HowItWorksMarquee>
      <VideoIntro></VideoIntro>
      <SocialMediaFeed></SocialMediaFeed>
      <LatestNews></LatestNews>
      <PartnersSection></PartnersSection>
      <ContactUs></ContactUs>

      <MapSection></MapSection>
    </section>
  );
};

export default Home;
