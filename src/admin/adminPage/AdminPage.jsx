import { useEffect, useState } from "react";
import { FaUsers, FaUserPlus, FaTrash, FaCommentDots, FaUserCog, FaUserAlt } from "react-icons/fa";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import "./AdminPage.css"; // Import CSS file
import { useNavigate } from "react-router-dom";
import ViewAllUsers from "../adminNav/AdminComponent";

const AdminPanel = () => {
  const [selectedOption, setSelectedOption] = useState("viewUsers");

  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role"); // Fetch role from storage
    if (role !== "admin") {
      alert("Access Denied! Only admins can view this page.");
      navigate("/"); // Redirect to login if not admin
    }
  }, [navigate]);

  const renderContent = () => {
    switch (selectedOption) {
      case "viewUsers":
        return <h2>View Users (Shops List)</h2>;
      case "deleteUser":
        return <h2>Delete User (Remove Shop)</h2>;
      case "registerUser":
        return <h2>Register New User (New Shop)</h2>;
      case "registerAdmin":
        return <h2>Register New Admin</h2>;
      case "viewAll":
        return <ViewAllUsers />;
      default:
        return <h2>Select an option</h2>;
    }
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h1 className="admin-logo">Admin Panel</h1>
        <ul className="menu">
          <li onClick={() => setSelectedOption("viewUsers")}><FaUsers /> View Users</li>
          <li onClick={() => setSelectedOption("deleteUser")}><FaTrash /> Delete User</li>
          <li onClick={() => setSelectedOption("registerUser")}><FaUserPlus /> Register User</li>
          <li onClick={() => setSelectedOption("registerAdmin")}><MdOutlineAdminPanelSettings /> Register Admin</li>
          <li onClick={() => setSelectedOption("viewAll")}><FaUserCog /> View All Users</li>
        </ul>
      </aside>

      {/* Main Panel */}
      <div className="main-panel">
        {/* Navbar */}
        <nav className="admin-navbar">
          <input type="text" placeholder="Search here..." className="search-box" />
          <div className="nav-icons">
            <FaCommentDots className="icon" />
            <FaUserAlt className="icon" onClick={() => document.getElementById("profileDropdown").classList.toggle("show")} />
            <div id="profileDropdown" className="profile-dropdown">
              <p>Admin Name</p>
              <p>admin@example.com</p>
              <hr />
              {/* <button onClick={() => alert("Logging out...")}>Logout</button> */}
            </div>
          </div>
        </nav>

        {/* Content Panel */}
        <div className="content">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AdminPanel;
