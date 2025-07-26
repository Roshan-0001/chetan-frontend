import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import "./RegisterMultipleUsers.css";

const initialUser = {
  username: "",
  email: "",
  password: "",
  number: "",
  address: "",
  shopType: "",
  description: "",
  profileImage: null,
};

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

const RegisterMultipleUser = () => {
  const [users, setUsers] = useState([{ ...initialUser }]);
  const [errors, setErrors] = useState([{}]);
  const [showPreview, setShowPreview] = useState(false);
  const [registrationResult, setRegistrationResult] = useState(null);


  const validate = (user) => {
    const error = {};
    if (!user.username) error.username = "Username is required";
    if (!user.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) error.email = "Valid email required";
    if (!user.password || user.password.length < 6) error.password = "Min 6 chars password required";
    if (!user.number || !/^\d{10}$/.test(user.number)) error.number = "Valid 10-digit phone required";
    if (!user.address) error.address = "Address is required";
    if (!user.shopType) error.shopType = "Select a shop type";
    return error;
  };

  const handleChange = (index, field, value) => {
    const newUsers = [...users];
    newUsers[index][field] = value;
    setUsers(newUsers);

    const newErrors = [...errors];
    newErrors[index] = validate(newUsers[index]);
    setErrors(newErrors);
  };

  const handleImageChange = (index, file) => {
    const newUsers = [...users];
    newUsers[index].profileImage = file;
    setUsers(newUsers);
  };

  const addUser = () => {
    setUsers([...users, { ...initialUser }]);
    setErrors([...errors, {}]);
  };

  const deleteUser = (index) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const updatedUsers = users.filter((_, i) => i !== index);
      const updatedErrors = errors.filter((_, i) => i !== index);
      setUsers(updatedUsers);
      setErrors(updatedErrors);
    }
  };

  const previewSubmit = () => {
    const newErrors = users.map(validate);
    setErrors(newErrors);
    const hasError = newErrors.some((e) => Object.keys(e).length > 0);
    if (hasError) {
      toast.error("Please fix all validation errors before preview.");
      return;
    }
    setShowPreview(true);
  };

const finalSubmit = async () => {
  try {
    const formData = new FormData();

    // Append userCount
    formData.append("userCount", users.length.toString());

    // Build userData object (excluding profileImage from JSON)
    const userDataObj = {};
    users.forEach((user, index) => {
      const key = `user${index + 1}`;
      const { profileImage, ...userFields } = user;
      userDataObj[key] = userFields;

      // Append image for each user
      if (profileImage) {
        formData.append("profileImage", profileImage); // Append all images under the same field name
      }
    });

    // Append stringified user data
    formData.append("userData", JSON.stringify(userDataObj));

    // Make the fetch request
    const response = await fetch(`${import.meta.env.VITE_URL}/admin/register-multiple-user`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        // DO NOT manually set Content-Type when sending FormData; fetch handles it.
      },
      body: formData,
    });

    const data = await response.json();

    if (response.ok && data.success) {
        
      setRegistrationResult(data.data);
      toast.success("✅ Users registered successfully!");
      setShowPreview(false);
      setUsers([{ ...initialUser }]);
      setErrors([{}]);
    } else {
      toast.error(`❌ Registration failed: ${data.errors || "Unknown error"}`);
    }
  } catch (error) {
    console.error("Registration Error:", error);
    toast.error("❌ Something went wrong during registration.");
  }
};



  return (
    <div className="rm-user-container">
      <h2 className="rm-title">Register Multiple Users</h2>
      {users.map((user, index) => (
        <motion.div key={index} className="rm-user-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <button className="rm-delete-button" onClick={() => deleteUser(index)}>❌</button>
          <input type="text" placeholder="Username" value={user.username} onChange={(e) => handleChange(index, "username", e.target.value)} />
          {errors[index]?.username && <span className="rm-error">{errors[index].username}</span>}

          <input type="email" placeholder="Email" value={user.email} onChange={(e) => handleChange(index, "email", e.target.value)} />
          {errors[index]?.email && <span className="rm-error">{errors[index].email}</span>}

          <input type="password" placeholder="Password" value={user.password} onChange={(e) => handleChange(index, "password", e.target.value)} />
          {errors[index]?.password && <span className="rm-error">{errors[index].password}</span>}

          <input type="text" placeholder="Phone Number" value={user.number} onChange={(e) => handleChange(index, "number", e.target.value)} />
          {errors[index]?.number && <span className="rm-error">{errors[index].number}</span>}

          <input type="text" placeholder="Address" value={user.address} onChange={(e) => handleChange(index, "address", e.target.value)} />
          {errors[index]?.address && <span className="rm-error">{errors[index].address}</span>}

          <select value={user.shopType} onChange={(e) => handleChange(index, "shopType", e.target.value)}>
            <option value="">Select Shop Type</option>
            {shopTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors[index]?.shopType && <span className="rm-error">{errors[index].shopType}</span>}

          <textarea placeholder="Description" value={user.description} onChange={(e) => handleChange(index, "description", e.target.value)} />
          <input type="file" onChange={(e) => handleImageChange(index, e.target.files[0])} />
        </motion.div>
      ))}

      <div className="rm-action-buttons">
        <button className="rm-btn" onClick={addUser}>Add New User</button>
        <button className="rm-btn" onClick={previewSubmit}>Submit</button>
      </div>

      {showPreview && (
        <div className="rm-preview-popup">
          <h3>Preview All Users</h3>
          <table className="rm-preview-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Shop Type</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i}>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.number}</td>
                  <td>{u.shopType}</td>
                  <td>{u.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="rm-preview-actions">
            <button className="rm-btn" onClick={finalSubmit}>Confirm and Submit</button>
            <button className="rm-btn" onClick={() => setShowPreview(false)}>Cancel</button>
          </div>
        </div>
      )}

      {registrationResult && (
  <div className="result-summary">
    <h3>Registration Result</h3>

    {registrationResult.createdUsers?.length > 0 && (
      <>
        <h4>✅ Successfully Registered:</h4>
        <ul>
          {registrationResult.createdUsers.map((user, i) => (
            <li key={i}>{user.username} ({user.email}) </li>
          ))}
        </ul>
      </>
    )}

    {registrationResult.failedUsers?.length > 0 && (
      <>
        <h4>❌ Failed Registrations:</h4>
        <ul>
          {registrationResult.failedUsers.map((user, i) => (
            <li key={i}>
              {user.user} - <strong>{user.reason}</strong>
            </li>
          ))}
        </ul>
      </>
    )}
  </div>
)}


      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default RegisterMultipleUser;
