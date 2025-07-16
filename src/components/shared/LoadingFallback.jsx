import React from "react";
// import { DNA } from "react-loader-spinner";
import Lottie from "lottie-react";
import LottieAnimation from "../../assets/lotties/loadingLottieAnimation.json";

const LoadingFallback = () => {
  return (
    <>
      <div className="fontJakarta flex justify-center text-center mt-4 space-x-3 py-64">
        <Lottie style={{ width: '100px' }} animationData={LottieAnimation} loop={true} />

        {/* <DNA
          visible={true}
          height="80"
          width="80"
          ariaLabel="dna-loading"
          wrapperStyle={{}}
          wrapperClass="dna-wrapper"
        /> */}
      </div>
    </>
  );
};

export default LoadingFallback;
