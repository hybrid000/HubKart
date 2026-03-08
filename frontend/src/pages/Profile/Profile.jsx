import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./Profile.css";

const Profile = () => {
  const { user } = useContext(AuthContext);

  const [editing, setEditing] = useState(false);

  const [name, setName] = useState(user.username);
  const [gender, setGender] = useState(user.gender || "");

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>My Profile</h2>

        <label>Name</label>
        <input
          value={name}
          disabled={!editing}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Gender</label>
        <select
          disabled={!editing}
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Select</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        {!editing ? (
          <button className="profile-edit" onClick={() => setEditing(true)}>
            Edit
          </button>
        ) : (
          <button className="profile-save" onClick={() => setEditing(false)}>
            Save
          </button>
        )}

        <div className="profile-actions">
          <button>My Cart</button>
          <button>My Wishlist</button>
          <button>My Orders</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
