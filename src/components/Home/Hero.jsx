import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"
import bannerImg1 from '../../../public/Bannar1.jpg';
import bannerImg2 from '../../../public/Bannar2.jpg';
import bannerImg3 from '../../../public/Bannar3.jpg';
import { Carousel } from 'react-responsive-carousel';
import { Link } from 'react-router';

const Banner = () => {
    return (
        <Carousel autoPlay={true} infiniteLoop={true} showThumbs={false}>
            <div>
                <img src={bannerImg1} />
                <Link to="/all-properties">
                    <p className="legend">Legend 1</p>
                </Link>
            </div>
            <div>
                <img src={bannerImg2} />
                <p className="legend">Legend 2</p>
            </div>
            <div>
                <img src={bannerImg3} />
                <p className="legend">Legend 3</p>
            </div>
        </Carousel>
    );
};

export default Banner;