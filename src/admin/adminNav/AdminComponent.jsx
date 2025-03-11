import React, { useEffect, useState } from "react";
import "./AdminComponent.css"

const url = import.meta.env.VITE_URL;

const ViewAllUsers = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
                const response = await fetch(url + "/admin/view-all-users", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const result = await response.json();

                // Extract users array from response
                setUsers(Array.isArray(result.data) ? result.data : []);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div>
            <h2>All Users</h2>
            {users.length === 0 ? (
                <p>No users found</p>
            ) : (
                <table border="1">
                    <thead>
                        <tr>
                            <th>Profile</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Number</th>
                            <th>Verified</th>
                            <th>Address</th>
                            <th>Shop Type</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>
                                    <img
                                        src={user.profileImage}
                                        alt={user.username}
                                        width="50"
                                        height="50"
                                        style={{ borderRadius: "50%" }}
                                    />
                                </td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.number}</td>
                                <td>{user.isVerified ? "✅ Yes" : "❌ No"}</td>
                                <td>{user.address}</td>
                                <td>{user.shopType}</td>
                                <td>{user.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

async function fetchingUser(searchInput, setUserData, setError) {

    const token = localStorage.getItem("token"); // Get token from localStorage


    const response = await fetch(url + "/admin/view-one-user", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send token in request
        },
        body: JSON.stringify(searchInput),
    });

    const data = await response.json();
    if (response.ok) {
        setUserData(data.data);
    } else {
        setError(data.message || "User not found");
    }
};

const ViewUser = () => {
    const [searchInput, setSearchInput] = useState({ email: "", number: "", username: "" });
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Allow only one input field to be filled at a time
        setSearchInput({ email: "", number: "", username: "", [name]: value });
    };

    const fetchUser = () => {
        setError("");
        setUserData(null);
        try {
            fetchingUser(searchInput, setUserData, setError);
        } catch (err) {
            setError("Failed to fetch user data");
        }
    }

    return (
        <div className="viewUserContainer">
            <h2>Search User</h2>

            <div className="viewUserForm">
                <input
                    className="viewUserInput"
                    type="text"
                    name="email"
                    placeholder="Enter Email"
                    value={searchInput.email}
                    onChange={handleChange}
                />
                <input
                    className="viewUserInput"
                    type="text"
                    name="number"
                    placeholder="Enter Number"
                    value={searchInput.number}
                    onChange={handleChange}
                />
                <input
                    className="viewUserInput"
                    type="text"
                    name="username"
                    placeholder="Enter Username"
                    value={searchInput.username}
                    onChange={handleChange}
                />
                <button className="viewUserBtn" onClick={fetchUser}>Search</button>
            </div>

            {error && <p className="error">{error}</p>}

            {userData && (
                <div className="user-card">
                    <img src={userData.profileImage} alt="User" />
                    <h3>{userData.username}</h3>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Number:</strong> {userData.number}</p>
                    <p><strong>Verified:</strong> {userData.isVerified ? "Yes" : "No"}</p>
                    <p><strong>Address:</strong> {userData.address}</p>
                    <p><strong>Shop Type:</strong> {userData.shopType}</p>
                    <p><strong>Description:</strong> {userData.description}</p>
                </div>
            )}
        </div>
    );
};


const ViewAndDeleteUser = () => {
    const [searchInput, setSearchInput] = useState({ email: "", number: "", username: "" });
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState("");
    const [deleteMessage, setDeleteMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSearchInput({ email: "", number: "", username: "", [name]: value });
    };

    const fetchUser = async () => {
        setError("");
        setUserData(null);
        setDeleteMessage("");

        try {
            fetchingUser(searchInput, setUserData, setError);

        } catch (err) {
            setError("Failed to fetch user data");
        }
    };

    const deleteUser = async () => {
        if (!userData || !userData._id) return;

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(url + "/admin/delete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(searchInput),
            });

            const data = await response.json();
            if (response.ok) {
                setDeleteMessage("User deleted successfully!");
                setUserData(null);
            } else {
                setError(data.message || "Failed to delete user");
            }
        } catch (err) {
            setError("Error deleting user");
        }
    };

    return (
        <div className="viewUserContainer">
            <h2>Search User</h2>

            <div className="viewUserForm">
                <input
                    className="viewUserInput"
                    type="text"
                    name="email"
                    placeholder="Enter Email"
                    value={searchInput.email}
                    onChange={handleChange}
                />
                <input
                    className="viewUserInput"
                    type="text"
                    name="number"
                    placeholder="Enter Number"
                    value={searchInput.number}
                    onChange={handleChange}
                />
                <input
                    className="viewUserInput"
                    type="text"
                    name="username"
                    placeholder="Enter Username"
                    value={searchInput.username}
                    onChange={handleChange}
                />
                <button className="viewUserBtn" onClick={fetchUser}>Search</button>
            </div>

            {error && <p className="error">{error}</p>}
            {deleteMessage && <p className="success">{deleteMessage}</p>}

            {userData && (
                <div className="user-card">
                    <img src={userData.profileImage} alt="User" />
                    <h3>{userData.username}</h3>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Number:</strong> {userData.number}</p>
                    <p><strong>Verified:</strong> {userData.isVerified ? "Yes" : "No"}</p>
                    <p><strong>Address:</strong> {userData.address}</p>
                    <p><strong>Shop Type:</strong> {userData.shopType}</p>
                    <p><strong>Description:</strong> {userData.description}</p>
                    <button className="delete-btn viewUserBtn" onClick={deleteUser}>Delete User</button>
                </div>
            )}
        </div>
    );
};


export { ViewAllUsers, ViewUser, ViewAndDeleteUser };
