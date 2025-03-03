import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from 'react';
import { useState } from 'react';
import './App.css';
import axios from 'axios';
import Navbar from './navbar/Navbar.jsx';
import AdminPanel from './admin/adminPage/AdminPage.jsx';

const url = import.meta.env.VITE_URL;

function App() {

  const [data, setData] = useState(null);

  result();

  async function result() {
    try {
      if (!data) {
        const response = await axios.get(url + "/api/user");
        setData(response.data);
        console.log(data);
        console.log('Axios response details:', response.data);

      }

    } catch (error) {
      console.error('Axios error details:', error.response?.data || error.message);
    }
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navbar />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
      <main className="p-4">
        {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : 'Loading...'}
      </main>
    </Router>
  )
}

export default App
