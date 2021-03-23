import React, { useState } from 'react';
import {ReactComponent as GoogleIcon} from '../googleIcon.svg';
import {useAuth} from './AuthContext';
import Button from '@material-ui/core/Button';
import './Login.css'
import Navbar from '../Navbar/Navbar';
import Footer from '../pages/Footer.js/Footer';

export default function Login() {
  const [loading,setLoading] = useState(false);
  
  const {currentUser,googleLogin} = useAuth();
 
  function handleLogin(){
    setLoading(true);
    googleLogin();
    setLoading(false);
  }

  return (
    <>
      <Navbar/>
      <div className="login-container">
          <div className="image-container">
                <img className="login-image" src="images/login.svg" alt="login"></img>
          </div>
          <div>
            <div className="login-screen">
              <h1>
                Welcome to CalWin - Sign In <hr/>
                {currentUser && currentUser.email}
              </h1>
              <div className="login-button" style={{margin:"2% 1%",display:"inline-block"}}>
              <Button disabled={loading} onClick={handleLogin} style={{backgroundColor: "rgb(66, 133, 244)", color: "white"}} color="secondary">
                  <span><GoogleIcon style={{height: "30px", backgroundColor:"white", padding:"2%"}}/> &nbsp; Sign In With Google</span>
              </Button>
              </div>
            </div>
          </div>
      </div>
      <Footer/>
    </>
  );
}
