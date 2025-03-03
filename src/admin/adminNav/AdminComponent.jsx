import React, { useEffect, useState } from "react";

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
        console.log("Fetched Data:", result);

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

export default ViewAllUsers;
