import React,{useState} from 'react';
import './App.css';
import Home from './pages/HomePage/Home';
import Services from './pages/Services/Services';
import Events from './Home/Events';

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
import HolidayContext from './Home/HolidayContext';
axios.defaults.withCredentials = true;
 
function App() {

  return (

    <Router>
        <HolidayContext>
    <AuthProvider>
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path="/events" component={Events} />
          <Route path='/services' component={Services} />
          <Route path='/sign-up' component={Login} />
          <Route path='/calendar/:uid' component={HomePage} />
          <Route path="/login" component={Login}/>
        </Switch>
        </AuthProvider>
        </HolidayContext>
    </Router>
  );
}

export default App;
