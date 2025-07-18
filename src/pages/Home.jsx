import Advertisement from "../components/Home/Advertisement";
import Hero from "../components/Home/Hero";
import LatestUserReviews from "../components/Home/LatestUserReviews";

const Home = () => {
    return (
        <section>
            <Hero></Hero>
            <Advertisement></Advertisement>
            <LatestUserReviews></LatestUserReviews>
        </section>
    );
};
export default Home;