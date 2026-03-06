import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while fetching auth status
  }

  return user ? children : <Navigate to="/user/login" />;
};

export default ProtectedRoute;
