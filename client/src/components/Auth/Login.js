import React from 'react';
import {ReactComponent as GoogleIcon} from '../googleIcon.svg';
import { useHistory } from "react-router-dom";
import { auth} from "../../firbase";
import firebase from "../../firbase";
import Button from '@material-ui/core/Button';
import './Login.css'

export default function Login() {
  const history = useHistory();
  async function googleLogin(){

    const provider = new firebase.auth.GoogleAuthProvider();
    await auth.signInWithPopup(provider).then(
      async (result) => {
        //3 - pick the result and store the token
        const token = await auth?.currentUser?.getIdToken(true);                               
        //4 - check if have token in the current user
        if (token) {
          //5 - put the token at localStorage (We'll use this to make requests)
          localStorage.setItem("@token", token);
          //6 - navigate user to the book list
          history.push("/success");
        }
      },
      function (err) {
        console.log(err);
      }
    );
  }
    return (
        <div>
            <div>
              <h1 class="login-text">CalWin:Calendar for a Win</h1>
            </div>
            <div>
              <div class="login-screen">
              <img class="login-image" src="images/login.svg" alt="login"></img>
                <div class="login-button" style={{margin:"2% 1%",display:"inline-block"}}>
                <Button onClick={googleLogin} style={{backgroundColor: "rgb(66, 133, 244)", color: "white"}} color="secondary">
                    <span><GoogleIcon style={{height: "30px", backgroundColor:"white", padding:"2%"}}/> &nbsp; Sign In With Google</span>
                </Button>
                </div>
              </div>
            
            </div>
        </div>
    );
}
