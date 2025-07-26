import { useEffect, useState } from "react";
import { FaUsers, FaUserPlus, FaTrash, FaCommentDots, FaUserCog, FaUserAlt } from "react-icons/fa";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import "./AdminPage.css"; // Import CSS file
import { useNavigate } from "react-router-dom";
import { ViewAllUsers, ViewAndDeleteUser, ViewUser, RegisterAdmin, RegisterUser, AdminLogoutBtn, ViewAllAdmins } from "../adminNav/AdminComponent";
import RegisterMultipleUsers from "../adminNav/components/RegisterMultipleUsers";
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
      case "searchUser":
        return <ViewUser />;
      case "deleteUser":
        return <ViewAndDeleteUser />;
      case "registerUser":
        return <RegisterUser />;
      case "registerMultipleUser":
        return <RegisterMultipleUsers />;
      case "registerAdmin":
        return <RegisterAdmin />;
      case "viewAll":
        return <ViewAllUsers />;
      case "viewAllAdmin":
        return <ViewAllAdmins />;
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
          <li onClick={() => setSelectedOption("searchUser")}><FaUsers /> Search Users</li>
          <li onClick={() => setSelectedOption("deleteUser")}><FaTrash /> Delete User</li>
          <li onClick={() => setSelectedOption("registerUser")}><FaUserPlus /> Register User</li>
          <li onClick={() => setSelectedOption("registerMultipleUser")}><FaUserPlus /> Register Multiple Users</li>
          <li onClick={() => setSelectedOption("registerAdmin")}><MdOutlineAdminPanelSettings /> Register Admin</li>
          <li onClick={() => setSelectedOption("viewAll")}><FaUserCog /> View All Users</li>
          <li onClick={() => setSelectedOption("viewAllAdmin")}><FaUserCog /> View All admins</li>
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
              <p>Name: {localStorage.username}</p>
              <p>Email: {localStorage.email}</p>
              <p>Number: {localStorage.number}</p>
              <hr />
              <AdminLogoutBtn/>
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
