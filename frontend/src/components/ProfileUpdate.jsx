import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProfileUpdate = ({ username, onBack }) => {
  const [newUsername, setNewUsername] = useState(username);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const { fetchAuthStatus } = useContext(AuthContext); // Access AuthContext

  const handleUsernameUpdate = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/user/change-username",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: newUsername }),
          credentials: "include", // include cookies for auth
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Fetch new user data to update the AuthContext
        await fetchAuthStatus();
        alert(data.message);
        setIsEditingUsername(false);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("An error occurred while updating the username.");
      console.error(error);
    }
  };

  const handlePasswordUpdate = async () => {
    // Check if new password and confirm new password match
    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/user/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmNewPassword,
          }),
          credentials: "include", // include cookies for auth
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setIsEditingPassword(false);
        // Optionally, you can log the user out after a successful password change
        // await fetchAuthStatus();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("An error occurred while updating the password.");
      console.error(error);
    }
  };

  return (
    <div className="profile-update-container">
      {!isEditingUsername && !isEditingPassword && (
        <div className="edit-options">
          <div className="edit-option">
            <span>Username: {newUsername}</span>
            <button
              onClick={() => setIsEditingUsername(true)}
              className="edit-button"
            >
              Edit
            </button>
          </div>
          <div className="edit-option">
            <span>Password: ••••••••</span>
            <button
              onClick={() => setIsEditingPassword(true)}
              className="edit-button"
            >
              Edit
            </button>
          </div>
        </div>
      )}

      {isEditingUsername && (
        <div className="username-update">
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
          <button onClick={handleUsernameUpdate} className="save-button">
            Save
          </button>
          <button
            onClick={() => setIsEditingUsername(false)}
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      )}

      {isEditingPassword && (
        <div className="password-update">
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          <button onClick={handlePasswordUpdate} className="save-button">
            Save
          </button>
          <button
            onClick={() => setIsEditingPassword(false)}
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileUpdate;
