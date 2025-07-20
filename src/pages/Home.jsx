import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Advertisement from "../components/Home/Advertisement";
import Hero from "../components/Home/Hero";
import LatestUserReviews from "../components/Home/LatestUserReviews";
import LoadingFallback from "../components/shared/LoadingFallback";

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
      <Hero />
      <Advertisement properties={properties} />
      <LatestUserReviews reviews={reviews} />
    </section>
  );
};

export default Home;
