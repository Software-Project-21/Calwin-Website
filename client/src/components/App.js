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

// import axios from 'axios';
import Login from './Auth/Login';
import HomePage from './Home/HomePage';
import { AuthProvider} from './Auth/AuthContext';
import HolidayContext from './Home/HolidayContext';
import moment from 'moment';
import firebase from '../firbase';

import Notifications from './Notifications/Notifications';
// axios.defaults.withCredentials = true;
 
function App() {


  const [val,setVal] = useState(moment());

  return (
    <Router>
        <HolidayContext val={val}>
    <AuthProvider>
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path="/events" component={Events} />
          <Route path='/services' component={Services} />
          <Route path='/sign-up' component={Login} />
          <Route path='/calendar/:uid' 
            render={(props) => <HomePage val={val} setVal={setVal} {...props} />}
          />
          <Route path="/login" component={Login}/>
          <Route path="/notifications" component={Notifications}  />
        </Switch>
        </AuthProvider>
        </HolidayContext>
    </Router>
  );
}

export default App;
