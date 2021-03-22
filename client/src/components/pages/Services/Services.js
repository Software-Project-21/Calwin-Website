import React from 'react';
import HeroSection from '../../HeroSection';
import { homeObjOne, homeObjTwo, homeObjThree, homeObjFour } from '../HomePage/Data';
// import Pricing from '../../Pricing';

function Services() {
  return (
    <>
      {/* <Pricing /> */}
      {/* <HeroSection {...homeObjOne} /> */}
      
      <HeroSection {...homeObjOne} />
      <HeroSection {...homeObjFour} />
    </>
    
  );
}

export default Services;
