import React, { useState } from 'react';
import {ReactComponent as GoogleIcon} from '../googleIcon.svg';
import {useAuth} from './AuthContext';
import Button from '@material-ui/core/Button';
import './Login.css';
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
                <img className="login-image" src="images/login.png" alt="login"></img>
          </div>
          <div className="login-screen">
            <h1 style={{color:"#ffffff", marginBottom:"20%"}}>Login</h1>
            <div className="login-button" style={{margin:"2% 1%",display:"inline-block"}}>
            <Button disabled={loading} onClick={handleLogin} style={{height:"120%",width:"20rem", backgroundColor: "#ffffff", color: "#000000", borderTopLeftRadius:"50px", borderBottomLeftRadius:"50px", borderTopRightRadius:"50px", borderBottomRightRadius:"50px"}} color="secondary">
                <span>
                  <img src="images/google-logo.svg" alt="logo" style={{height:"40px", padding:"2%"}}></img>
                  {/* <GoogleIcon style={{height: "40px", backgroundColor:"white",marginTop:"10px"}}/> */}
                  <span>Sign In With Google</span>
                </span>
            </Button>
            </div>
          </div>
      </div>
      <Footer/>
    </>
  );
}
