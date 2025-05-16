import React from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <div className='w-screen flex flex-col items-center px-5 sm:px-10 md:px-20 lg:px-32 xl:px-40 gap-6 text-center'>
      <h1 
        className='font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[60px] leading-tight mt-10'
      >
        <span className='text-[#f56551]'>Discover Your Next Adventure with AI:</span> 
        Personalized itineraries at your Fingertips
      </h1> 
      
      <p className='text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-700'>
        Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.
      </p>

      <Link to={'/create-trip'}>
        <Button className="text-sm sm:text-base md:text-lg px-6 py-3">Get Started, It's Free</Button>
      </Link>

      <img src="/mockup.png" className='' alt="" />
    </div>
  );
}

export default Hero;
