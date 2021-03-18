import React from 'react';
import './App.css';
import Home from './pages/HomePage/Home';
import Services from './pages/Services/Services';
import SignUp from './pages/SignUp/SignUp';
// import { BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './pages/Footer.js/Footer';
import Success from './success'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import axios from 'axios';
import Login from './Auth/Login';
axios.defaults.withCredentials = true;

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/services' component={Services} />
        <Route path='/sign-up' component={Login} />
        <Route path='/success' component={Success} />
        <Route 
            path="/login" 
            render={
              () => <Login/>
            } />
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;
