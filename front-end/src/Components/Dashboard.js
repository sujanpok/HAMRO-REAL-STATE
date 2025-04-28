// Components/Dashboard.js

import React from 'react';
import { useLocation } from 'react-router-dom';

function Dashboard() {
  const location = useLocation();
  const { username, password } = location.state || {};

  return (
    <div className="container mt-5">
      <h1>Dashboard</h1>
      {username && password ? (
        <>
          <p><strong>Username:</strong> {username}</p>
          <p><strong>Password:</strong> {password}</p>
        </>
      ) : (
        <p>No user information available.</p>
      )}
    </div>
  );
}

export default Dashboard;
