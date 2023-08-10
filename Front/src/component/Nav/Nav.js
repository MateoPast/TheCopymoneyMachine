import "../Nav/Nav.css";
import React, { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

function Nav({ user_id, logout }) {
  const [showLinks, setShowLinks] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    logout();
    navigate("/login");
  };

  const handleLinkClick = () => {
    setShowLinks(false);
  };

  const { pathname } = useLocation();
  if (pathname === "/404") return null;

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  return (
    <div className="header_logo">
      <nav className={`navbar ${showLinks ? "show-nav" : "hide-nav"}`}>
        <ul className="navbar_links">
          <li><NavLink to="/" className="navbar_link" onClick={handleLinkClick}>Accueil</NavLink></li>
          <li><NavLink to="/trader-orders" className="navbar_link" onClick={handleLinkClick}>Trader Orders</NavLink></li>
          <li><NavLink to="/new-listing" className="navbar_newlisting navbar_link" onClick={handleLinkClick}>New listing</NavLink></li>
          {userInfo && <li><NavLink to="/profil" className="navbar_profile navbar_link" onClick={handleLinkClick}>Profil</NavLink></li>}
          {userInfo && <li><NavLink to="/my-orders" className="navbar_orders navbar_link" onClick={handleLinkClick}>My orders</NavLink></li>}
          {userInfo && <li><Link to="/" className="navbar_signout navbar_link" onClick={handleLogout}>Se déconnecter</Link></li>}
          {!userInfo && <li><NavLink to="/login" className="navbar_login navbar_link" onClick={handleLinkClick}>Se connecter</NavLink></li>}
          {!userInfo && <li><NavLink to="/signup" className="navbar_signup navbar_link" onClick={handleLinkClick}>S'inscrire</NavLink></li>}
          
        </ul>
        <button className="navbar_burger" onClick={() => setShowLinks(!showLinks)}>
          <span className="burger-bar"></span>
        </button>
      </nav>
    </div>
  );
}

export default Nav;
