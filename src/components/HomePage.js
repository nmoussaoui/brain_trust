import React from 'react';
import '../styles/HomePage.css';
import logo from '../assets/bt_logo.png';
import CustomButton from './CustomButton';

const HomePage = ({ startSetup }) => {
  return (
    <div className="home-page">
      <div className="container text-center">
        <img src={logo} alt="Brain Trust Logo" className="logo" />
        <CustomButton label="Jouer" onClick={startSetup} />
      </div>

    <div className='footer fixed-bottom'>
        <p>© 2024 Nassim Moussaoui</p>
    </div>

    </div>
  );
};

export default HomePage;
