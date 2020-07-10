import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Navbar from './components/navbar'
import Footer from './components/footer'
import store from 'store';

import Profile from './pages/profile';
import Chat from './pages/chat';
import Register from './pages/register';
import Registered from './pages/registered';
import Verify from './pages/verify';
import Login from './pages/login';
import Forgot from './pages/forgot'
import Settings from './pages/settings'
import Home from './pages/home'
import Browse from './pages/browse'

import nextPath from './helpers/nextPath';
import isLoggedIn from './helpers/is_logged_in';

const storage = require('./helpers/storage.js');

export default function App() {
  return (
    <Router>
      <div >
        <Navbar />


        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/profile/:username" component={(Profile)} />
          <Route path="/chat/:username" component={(Chat)} />
          <Route path="/profile">
            <MyProfile />
          </Route>
          <Route path="/users">
            <Users />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/registered">
            <Registered />
          </Route>
          <Route path="/login" component={(Login)} />
          <Route path="/forgot">
            <Forgot />
          </Route>
          <Route path="/verify" component={(Verify)} />
          <Route path="/logout">
            <Logout />
          </Route>
          <Route path="/setting">
            <Settings />
          </Route>
          <Route path="/browse">
            <Browse />
          </Route>
          <Route path="/">
            <Home />
          </Route>
          

        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

function Logout() {
  store.remove('loggedIn');
  store.remove('username');
  nextPath('/')
}

function Users() {
  return <h2>Users</h2>;
}

function MyProfile() {
  if (!isLoggedIn()) {
    window.location.href = "/login"
  }
  nextPath('/profile/' + storage.unhash(store.get('username')));
}