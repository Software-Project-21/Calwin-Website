import React, { useState } from 'react';
import { useHistory } from "react-router-dom";   
import {ReactComponent as GoogleIcon} from '../googleIcon.svg';
import {useAuth} from './AuthContext';
import Button from '@material-ui/core/Button';
import './Login.css'

export default function Login() {
  const [loading,setLoading] = useState(false);
  const history = useHistory();
  
  const {googleLogin,currentUser} = useAuth();
  const handleLogin = () => {
    setLoading(true);
    googleLogin();
    history.push('/calendar');
    setLoading(false);
  }
  return (
      <div className="login-container">
          <div className="image-container">
                <img className="login-image" src="images/login.svg" alt="login"></img>
          </div>
          <div>
            <div className="login-screen">
              <h1>
                Welcome to CalWin - Sign In <hr/>
                {currentUser.email}
              </h1>
              <div className="login-button" style={{margin:"2% 1%",display:"inline-block"}}>
              <Button disabled={loading} onClick={handleLogin} style={{backgroundColor: "rgb(66, 133, 244)", color: "white"}} color="secondary">
                  <span><GoogleIcon style={{height: "30px", backgroundColor:"white", padding:"2%"}}/> &nbsp; Sign In With Google</span>
              </Button>
              </div>
            </div>
          
          </div>
      </div>
  );
}
