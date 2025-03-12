import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {

  const [showPopup, setShowPopup] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [role, setRole] = useState("user");
  const [popupType, setPopupType] = useState(""); // 'login' or 'signup'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', number: '', shopType: '', description: '', address: '', profileImage: null })
  const url = import.meta.env.VITE_URL;
  const [user, setUser] = useState({
    username: '',
    email: '',
    fullName: '',
    number: ''
  });
  function updateUser() {
    setUser({
      username: localStorage.getItem("username"),
      fullName: localStorage.getItem("fullName"),
      number: localStorage.getItem("number"),
      email: localStorage.getItem("email"),
      role: localStorage.getItem("role"),
    });
  }

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  const handleFileChange = (e) => {
    setFormData({ ...formData, profileImage: e.target.files[0] });
  };

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
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('number', formData.number);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('shopType', formData.shopType);
      formDataToSend.append('description', formData.description);

      // Append file if selected
      if (formData.profileImage) {
        formDataToSend.append('profileImage', formData.profileImage);
      }
      const response = await fetch(url + '/api/user/register', {
        method: 'POST',
        body: formDataToSend,
      });



      const result = await response.json();

      if (response.ok) {
        setFormData({
          username: '',
          email: '',
          password: '',
          number: '',
          address: '',
          shopType: '',
          description: '',
          profileImage: null,
        });
        alert("Registration Successful");
        console.log('Registration successful:', result);
        ClosePopup();
      } else {
        alert(result.message || 'Signup failed');
      }
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
      console.log('Registration failed:', error);
    }
  };


  // Login Function (POST request to backend)
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = {
        admin: `${url}/admin/login-admin`,
        user: `${url}/api/user/login`,
      }[role];
      const response = await fetch(apiUrl, {
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
        localStorage.setItem("role", role); // Store role of the user
        localStorage.setItem("email", result.data.user.email); // Store email
        localStorage.setItem("number", result.data.user.number); // Store number
        updateUser();

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
      const type = localStorage.getItem("role");
      const apiUrl = {
        admin: `${url}/admin/logout-admin`,
        user: `${url}/api/user/logout`,
      }[type];

      const response = await fetch(apiUrl, {
        method: "POST",
        credentials: "include",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': "application/json",
        },
      });

      const result = await response.json();
      if (response.ok) {
        localStorage.clear();
        setIsLoggedIn(false);
        setShowSidebar(false);
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
      updateUser();
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
          <Link to="/admin">Admin Page</Link>

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
            <div className="user-icon" onClick={toggleSidebar}>
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
              {popupType === "login" && (
                <>
                  <div className="role-toggle">
                    <label>
                      <input
                        type="radio"
                        name="role"
                        value="admin"
                        checked={role === "admin"}
                        onChange={() => setRole("admin")}
                      />
                      Admin
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="role"
                        value="user"
                        checked={role === "user"}
                        onChange={() => setRole("user")}
                      />
                      User
                    </label>
                  </div>
                </>
              )}
              <input
                type="text"
                placeholder="username"
                id="username"
                value={formData.username}
                onChange={handleChange}
              // required
              />
              <input
                type="password"
                placeholder="Password"
                id="password"
                value={formData.password}
                onChange={handleChange}
              // required
              />
              {popupType === "signup" && (
                <><input
                  type="text"
                  id="address"
                  placeholder="address"
                  value={formData.address}
                  onChange={handleChange}
                // required
                />
                  <input
                    type="email"
                    id="email"
                    placeholder="email"
                    value={formData.email}
                    onChange={handleChange}
                  // required
                  />
                  <input
                    type="number"
                    id="number"
                    placeholder="number"
                    value={formData.number}
                    onChange={handleChange}
                  // required
                  />
                  <select name="shopType" id="shopType" value={formData.shopType} onChange={handleChange} >
                    <option value="">Select Shop Type</option>
                    <option value="grocery">Grocery</option>
                    <option value="bakery">Bakery</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="stationary">Stationary</option>
                    <option value="pharmacy">Pharmacy</option>
                    <option value="clothing">Clothing</option>
                    <option value="electronics">Electronics</option>
                    <option value="cosmetics">Cosmetics</option>
                    <option value="internet-cafe">Internet Cafe</option>
                    <option value="other">Other</option>
                  </select>
                  <input type="file"
                    name="profileImage"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                  />
                  <textarea
                    name="description"
                    placeholder="Description"
                    id="description"
                    value={formData.description}
                    onChange={handleChange}
                  // required
                  />
                </>
              )}
              <button type="submit" className="popup-btn btn">
                {popupType === "login" ? "Login" : "Sign Up"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Sidebar for user details */}
      {showSidebar && (
        <div className="sidebar">
          <div className="sidebar-content">
            <button className="close-btn" onClick={toggleSidebar}>✖</button>
            {/* <img src={user.profileImage} alt="Profile" className="sidebar-pic" /> */}
            <h3>{user.role}</h3>
            <h2>{user.username}</h2>
            <p>{user.email}</p>
            <p>{user.number}</p>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
