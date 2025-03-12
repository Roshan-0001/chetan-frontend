import React, { useEffect, useState } from "react";
import "./AdminComponent.css";
import { useNavigate } from "react-router-dom";

const url = import.meta.env.VITE_URL;

const ViewAllAdmins = () => {
    const [admins, setAdmins] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
                const response = await fetch(url + "/admin/view-all-admins", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const result = await response.json();

                // Extract users array from response
                setAdmins(Array.isArray(result.data) ? result.data : []);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    const handleDelete = async (_id) => {
        if (!window.confirm("Are you sure you want to delete this admin?")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(url + "/admin/delete-admin", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "content-Type": "application/json",
                },
                body: JSON.stringify({ _id }),
            });

            if (response.ok) {
                alert("Admin deleted successfully!");
                setAdmins((prevAdmins) => prevAdmins.filter(admin => admin._id !== _id));// Update state
            } else {
                alert("Failed to delete admin.");
            }
        } catch (error) {
            console.error("Error deleting admin:", error);
        }
    };

    return (
        <div>
            <h2>All Admins</h2>
            {admins.length === 0 ? (
                <p>No Admin found</p>
            ) : (
                <table border="1">
                    <thead>
                        <tr>
                            <th>Fullname</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Number</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.map((admin) => (
                            <tr key={admin._id}>
                                <td>{admin.fullName}</td>
                                <td>{admin.username}</td>
                                <td>{admin.email}</td>
                                <td>{admin.number}</td>
                                <td>
                                    {["yogita", "papa", "roshan123"].includes(admin.username) ? (
                                        <span style={{ backgroundColor: "red" ,padding: "2px 4px", borderRadius: "3px"}}>Protected</span> // Show text instead of button
                                    ) : (
                                        <button onClick={() => handleDelete(admin._id)}>Delete</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};
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
            <h2>Search here to delete the User</h2>

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


const RegisterAdmin = () => {
    const [formData, setFormData] = useState({
        username: "",
        fullName: "",
        email: "",
        password: "",
        number: "",
    });
    const token = localStorage.token;

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async () => {
        const token = localStorage.getItem("token"); // Retrieve stored admin token
        try {
            const response = await fetch(url + "/admin/register-admin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(`${data.data.username} registered as admin successfully!`);
            } else {
                setMessage(`Error: ${data.message}`);
            }
        } catch (error) {
            setMessage("Registration failed. Please try again.");
        }
    };

    return (
        <div>
            <h2>Register New Admin</h2>
            <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
            />
            <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
            />
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
            />
            <input
                type="number"
                name="number"
                placeholder="Phone Number"
                value={formData.number}
                onChange={handleChange}
            />
            <button onClick={handleRegister}>Register Admin</button>
            {message && <p>{message}</p>}
        </div>
    );
};

const RegisterUser = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        number: "",
        address: "",
        shopType: "",
        description: "",
        profileImage: null,
    });

    const [message, setMessage] = useState("");

    const shopTypes = [
        "grocery",
        "bakery",
        "restaurant",
        "stationary",
        "pharmacy",
        "clothing",
        "electronics",
        "cosmetics",
        "internet-cafe",
        "other",
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, profileImage: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
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
            const token = localStorage.getItem("token"); // Get auth token
            const response = await fetch(url + "/admin/register-user", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`, // Send token for authentication
                },
                body: formDataToSend,
            });
            const data = await response.json();

            if (response.ok) {
                setMessage("User registered successfully!");
                setFormData({
                    username: "",
                    email: "",
                    password: "",
                    number: "",
                    address: "",
                    shopType: "",
                    description: "",
                    profileImage: null,
                });
            } else {
                setMessage(data.message || "Registration failed.");
            }
        } catch (error) {
            setMessage("An error occurred. Please try again.");
        }
    };

    return (
        <div>
            <h2>Register New User</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                <input type="number" name="number" placeholder="Phone Number" value={formData.number} onChange={handleChange} required />
                <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />

                <select name="shopType" value={formData.shopType} onChange={handleChange}>
                    <option value="">Select Shop Type</option>
                    {shopTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>

                <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />

                <input type="file" accept="image/*" name="profileImage" onChange={handleFileChange} required />

                <button type="submit">Register</button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
};

const AdminLogoutBtn = () => {
    const navigate = useNavigate(); // Move useNavigate() inside the component

    const handleAdminLogout = async () => {
        const token = localStorage.getItem("token"); // Use getItem instead of direct access

        try {

            const response = await fetch(url + "/admin/logout-admin", {
                method: "POST",
                credentials: "include",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const result = await response.json();
            if (response.ok) {
                localStorage.clear();
                alert(result.message);
                navigate("/"); // Navigate to home page
            } else {
                alert(result.message || "Logout failed");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <button onClick={handleAdminLogout}>Logout</button>
    );
};



export { ViewAllAdmins, ViewAllUsers, ViewUser, ViewAndDeleteUser, RegisterAdmin, RegisterUser, AdminLogoutBtn };
