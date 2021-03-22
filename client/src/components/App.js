import React from 'react';
import './App.css';
import Home from './pages/HomePage/Home';
import Services from './pages/Services/Services';
// import SignUp from './pages/SignUp/SignUp';
// import { BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
// import Navbar from './Navbar';
import Footer from './pages/Footer.js/Footer';
// import Success from './success'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import axios from 'axios';
import Login from './Auth/Login';
import HomePage from './Home/HomePage';
import { AuthProvider} from './Auth/AuthContext';
import PrivateRoute from './PrivateRoute';
// import Calendar from 'react-calendar';
axios.defaults.withCredentials = true;

function App() {

  return (
    <Router>
      <AuthProvider>
        {/* <Navbar /> */}
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/services' component={Services} />
          <Route path='/sign-up' component={Login} />
          <Route path='/calendar' component={HomePage} />
          <Route path="/login" 
            render={
                () => <Login/>
          } />
          {/* <Route path="/calendar"
            render={
              () => {
                if(currentUser){
                  return <HomePage/>
                } else{
                  return <Redirect to="/login"/>
                }
              } 
            }
          /> */}
          {/* </Route> */}
          {/* <PrivateRoute path='/calendar' component={HomePage}/> */}
          {/* <Route 
          path="/calendar" exact
            render={
              (props) => {
                currentUser ? <HomePage {...props}/> : <Redirect to='/login'/>
              }
            }/> */}
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
