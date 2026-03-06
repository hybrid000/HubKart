import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState(user?.username || "");
  const [gender, setGender] = useState(user?.gender || "");

  const handleLogout = async () => {
    await fetch("http://localhost:5000/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
    navigate("/");
  };

  const handleSave = async () => {
    await fetch("http://localhost:5000/user/update-profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username: name, gender }),
    });

    setUser({ ...user, username: name, gender });
  };

  return (
    <div className="profile-container">
      <h2>My Profile</h2>

      <div className="profile-card">
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />

        <label>Gender</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Select</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <button onClick={handleSave} className="profile-save">
          Save
        </button>
      </div>

      <div className="profile-links">
        <button onClick={() => navigate("/user/cart")}>My Cart</button>

        <button onClick={() => navigate("/user/wishlist")}>My Wishlist</button>

        <button onClick={() => navigate("/user/orders")}>My Orders</button>

        <button onClick={handleLogout} className="logout">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
