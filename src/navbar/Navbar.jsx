import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Navbar.css";

const Navbar = () => {

  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(""); // 'login' or 'signup'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', fullName: '', number: '' })
  const url = import.meta.env.VITE_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });

  }

  // Open login/signup popup
  const OpenPopup = (type) => {
    setPopupType(type);
    setShowPopup(true);
  };

  // Close popup
  const ClosePopup = () => {
    setShowPopup(false);
    setFormData({ username: '', email: '', password: '', fullName: '', number: '' });
  };

  // Signup Function (POST request to backend)
  const handleSignup = async (e) => {
    e.preventDefault();
    try {

      const response = await fetch(url + '/admin/register-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setFormData({ username: '', email: '', password: '' });
        alert("Registration Successful");
        console.log('Registration successful:', result);

      }
      ClosePopup();
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
      console.log('Registration failed:', result);
    }
  };


  // Login Function (POST request to backend)
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(url + "/admin/login-admin", {
        method: "POST",
        credentials: "include",
        headers: {
          'Content-Type': "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);

        localStorage.setItem("token", result.data.accessToken);
        localStorage.setItem("username", result.data.user.username); // Store username

        setIsLoggedIn(true);
        ClosePopup();
      } else {
        alert(result.errors);
      }


    } catch (error) {
      console.error("Error----", error);
      alert(error.message || 'An unknown error occurred');
    }
  };

  // Logout Function
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(url + "/admin/logout-admin", {
        method: "POST",
        credentials: "include",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': "application/json",
        },
      });

      const result = await response.json();
      if (response.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setIsLoggedIn(false);
        alert(result.message);
      } else {
        alert(result.message || "Logout failed");
      }

    } catch (error) {
      console.log(error);
    }
  };

  // Check if user is logged in on page load
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsLoggedIn(true);
    }
  }, []);


  return (
    <div className={`container ${showPopup ? "blurred" : ""}`}>
      <nav className="navbar">
        {/* Logo */}
        <div className="logo">CHETAN MARKET</div>

        {/* Search Bar */}
        <div className="search-bar">
          <input type="text" placeholder="search" />
        </div>

        {/* Navigation Links */}
        <div className="nav-links">
          <a href="#">Products</a>
          <a href="#">Orders</a>

          {!isLoggedIn ? (
            <>
              <button className="btn" onClick={() => OpenPopup("login")}>
                login
              </button>
              <button className="btn" onClick={() => OpenPopup("signup")}>
                signup
              </button>
            </>
          ) : (
            <div className="user-icon" onClick={handleLogout}>
              👤 {localStorage.getItem("username")}
            </div>
          )}
        </div>
      </nav>

      {/* Popup Modal */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <button className="close-btn" onClick={ClosePopup}>
              ✖
            </button>

            <h2 className="popup-heading">{popupType === "login" ? "Login" : "Sign Up"}</h2>

            <form onSubmit={popupType === "login" ? handleLogin : handleSignup}>
              {popupType === "signup" && (
                <><input
                  type="string"
                  id="fullName"
                  placeholder="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
                  <input
                    type="email"
                    id="email"
                    placeholder="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="number"
                    id="number"
                    placeholder="number"
                    value={formData.number}
                    onChange={handleChange}
                    required
                  />
                </>
              )}
              <input
                type="text"
                placeholder="username"
                id="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                placeholder="Password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button type="submit" className="popup-btn btn">
                {popupType === "login" ? "Login" : "Sign Up"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
