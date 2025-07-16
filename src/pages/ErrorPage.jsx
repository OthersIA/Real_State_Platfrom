import React from 'react'
import { Link, useRouteError } from 'react-router'
import Button from '../components/shared/Button'
import Lottie from 'lottie-react'
import LottieAnimation from "../assets/lotties/404LottieAnimation";

const ErrorPage = () => {
  const error = useRouteError()

  return (
     <>
      <div className='fontJakarta py-6 text-center bg-base-200 min-h-screen'>
        {/* <Helmet>
          <title>Error</title>
        </Helmet> */}
        <h1 className='text-7xl font-thin flex justify-center' data-aos="zoom-in">
          <Lottie style={{ width: '500px' }} animationData={LottieAnimation} loop={true} />
        </h1>
        <p
          className='mb-12 text-2xl font-bold md:text-4xl lg:text-5xl max-w-4xl text-center mx-auto'
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {error?.error?.message || 'Something Went Wrong!'}
        </p>
        <Link to='/' data-aos="fade-up" data-aos-delay="400">
          <Button label='Back to Home' />
        </Link>
      </div>
    </>
  )
}

export default ErrorPage
