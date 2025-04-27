import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; // Import for redirection

function LoginPage() {
  const [username, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // For redirecting after successful login

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('https://api.hamrorealstate.store/login', {  // Using absolute URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Server Response:', data);
        console.log('Login successful!');
        // Redirecting to dashboard page after login
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        // Handle errors, showing error message from server if any
        setError(errorData.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Error:', err);
      // Handling errors if the network request fails
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <Wrapper className="bg-light">
      <div className="container">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-md-4">
            <div className="card shadow-lg rounded">
              <div className="card-body">
                <h3 className="text-center mb-4">Login</h3>
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">ID</label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      placeholder="ID/Phone Number"
                      value={username}
                      onChange={(e) => setId(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="d-grid mb-3">
                    <button type="submit" className="btn btn-primary">Login</button>
                  </div>
                </form>

                <div className="text-center mb-3">
                  <span>or</span>
                </div>

                <div className="d-grid gap-2">
                  <button className="btn btn-google" type="button">
                    <i className="bi bi-google"></i> Login with Google
                  </button>
                  <button className="btn btn-facebook" type="button">
                    <i className="bi bi-facebook"></i> Login with Facebook
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  .btn-google {
    background-color: #db4437;
    color: white;
  }
  .btn-facebook {
    background-color: #3b5998;
    color: white;
  }
  .btn-google:hover,
  .btn-facebook:hover {
    opacity: 0.9;
  }
`;

export default LoginPage;
