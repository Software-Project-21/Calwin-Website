import React from 'react';
import HeroSection from '../../HeroSection';
import Navbar from '../../Navbar/Navbar';
import Footer from '../Footer.js/Footer';
import { homeObjOne, homeObjFour } from './Data';
import firebase from '../../../firbase'

function Home() {

  
  return (
    <>
      <Navbar/>
      <HeroSection {...homeObjOne} />
      <HeroSection {...homeObjFour} />
      <Footer/>
    </>
  );
}

export default Home;
