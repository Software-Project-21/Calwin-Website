import React from 'react';

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
    {/* <Login/> */}
      <Switch>
           <Route 
            path="/login" 
            render={
              () => <Login/>
            } />
            <Route path="/" exact>
              <h1> CalWin </h1>
            </Route>
      </Switch>
    </Router>
  );
}

export default App;
