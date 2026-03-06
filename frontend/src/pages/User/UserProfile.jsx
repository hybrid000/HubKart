import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import ProfileUpdate from "../../components/ProfileUpdate";
import "../styles/profile.css";

const UserProfile = () => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const { user, logout} = useContext(AuthContext); // Use AuthContext
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/user/login");
    }
  }, [user, navigate]);

  const handleEditProfile = () => {
    setIsEditingProfile(true);
  };

  const handleBackToProfile = () => {
    setIsEditingProfile(false);
  };

  return (
    <>
      <head>
        <title>{user ? user.username : "User Profile"}</title>
      </head>
      <body>
        <div id="layer1">
          <a href="/">
            <img
              src="/resources/logo6.png"
              className="logoimg"
              alt="logo of site"
            />
          </a>
        </div>

        <div className="div">
          {!isEditingProfile ? (
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
            >
              <i className="fa-solid fa-angles-left"></i>Go Back
            </a>
          ) : (
            <button onClick={handleBackToProfile}>
              <i className="fa-solid fa-angles-left"></i>Back to Profile
            </button>
          )}
        </div>

        <div className="main-container">
          <div className="username">
            <img src="/resources/userProfile.gif" alt="" className="user" />

            {!isEditingProfile && user && (
              <p>
                {user.username}
                <br />
                <button onClick={handleEditProfile} className="edit-button">
                  <i className="fa-solid fa-pencil"></i>Edit Profile
                </button>
                <br />
                <button onClick={logout} className="logout-button">
                  <i className="fa-solid fa-arrow-right-from-bracket"></i>Logout
                </button>
              </p>
            )}

            {isEditingProfile && (
              <ProfileUpdate
                username={user ? user.username : ""}
                onBack={handleBackToProfile}
              />
            )}
          </div>

          {!isEditingProfile && (
            <div className="block">
              <a href="/user/orders" className="block-container">
                My Orders
              </a>
              <a href="/user/wishlist" className="block-container">
                My Wishlist
              </a>
              <a href="/user/cart" className="block-container">
                My Cart
              </a>
            </div>
          )}
        </div>
      </body>
    </>
  );
};

export default UserProfile;
