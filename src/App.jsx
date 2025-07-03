import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import './App.css';
import axios from "axios";
import Navbar from "./navbar/Navbar.jsx";
import AdminPanel from "./admin/adminPage/AdminPage.jsx";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import HomePage from "./homePage/HomePage.jsx";

const url = import.meta.env.VITE_URL;

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let interval;

    const fetchData = async () => {
      try {
        const response = await axios.get(url + "/api/user");
        setIsLoading(false);
        if (interval) clearInterval(interval); // Stop polling when data is received
      } catch (error) {
        console.error("Axios error details:", error.response?.data || error.message);
      }
    };

    // Start polling every 5 seconds
    interval = setInterval(() => {
      fetchData();
    }, 7000);

    // Try fetching once immediately
    fetchData();

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <Router>
      {isLoading ? (
        <div className="loading-screen">
          <h1>Starting backend... Please wait</h1>
          <DotLottieReact
            src='https://lottie.host/b9fbade1-4a05-469b-838a-8368f4d77329/AIrTLqNyTl.lottie'
            loop
            autoplay
            style={{ height: "300px", width: "300px" , margin: "50px auto"}}
          />
        </div>
      ) : (
        <>
        <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="*" element={<h1>404 - Page Not Found</h1>} /> {/* Handles unknown routes */}
          </Routes>
        </>
       )} 
    </Router>
  );
}

export default App;

