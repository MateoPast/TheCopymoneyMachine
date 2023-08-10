import './App.css';
import React, { useState } from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import Login from '../Login/Login';
import Home from '../Home/Home';
import TradersOrders from '../TradersOrders/TradersOrders';
import NewListing from '../NewListing/NewListing';
import Nav from '../Nav/Nav';
import Profil from '../Profil/Profil'
import Signup from '../Signup/Signup'
import UserOrders from '../UserOrders/UserOrders';


function App() {
  const [userInfo, setUserInfo] = useState(null);

  const handleLogout = () => {
    setUserInfo(null);
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
  }

  return (
    <div className="App">
      <BrowserRouter>
      <Nav logout={logout}/>
        <Routes>
          <Route
            path="/login"
            element={<Login/>}
          />
          <Route
            path="/"
            element={<Home/>}
          />

          <Route
            path="/profil"
            element={<Profil />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />
          <Route
            path="/my-orders"
            element={<UserOrders/>}
          />
          <Route path="/trader-orders" element={<TradersOrders/>} />

          <Route path="/new-listing" element={<NewListing/>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
