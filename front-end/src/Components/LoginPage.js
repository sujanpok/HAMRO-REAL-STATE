import React, { useState } from 'react';
import styled from 'styled-components';
<<<<<<< HEAD
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
=======
import { useNavigate } from 'react-router-dom';

function AuthPage() {
  // Toggle between Login and Signup
  const [isLogin, setIsLogin] = useState(true);
  //  Login felids
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  //  Signup felids
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    address: '',
    gender: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
    console.log(handleLoginChange)
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData({ ...signupData, [name]: value });
  };

  //BackEnd connection
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('https://api.hamrorealstate.store/login', {
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
=======
        body: JSON.stringify(loginData),
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Login Successful:', data);
        navigate('/dashboard', { state: loginData });
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed.');
      }
    } catch (err) {
      console.error('Login Error:', err);
      setError('Network error. Please try again.');
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    // Navigate to confirmation page with signup data
    navigate('/confirm', { state: { formData: signupData } });
  };

  return (
    <Wrapper>
      <div className="auth-container">
        <div className="toggle-buttons">
          <button className={isLogin ? 'active' : ''} onClick={() => setIsLogin(true)}>Login</button>
          <button className={!isLogin ? 'active' : ''} onClick={() => setIsLogin(false)}>Signup</button>
>>>>>>> boharaWork
        </div>

        {isLogin ? (
          <form className="form" onSubmit={handleLoginSubmit}>
            <h3>Login</h3>
            {error && <div className="error">{error}</div>}
            <input
              type="text"
              name="username"
              placeholder="Username or Phone"
              value={loginData.username}
              onChange={handleLoginChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleLoginChange}
              required
            />
            <button type="submit" className="submit-button">Login</button>
          </form>
        ) : (
          <form className="form" onSubmit={handleSignupSubmit}>
            <h3>Signup</h3>
            <div className="name-fields">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={signupData.firstName}
                onChange={handleSignupChange}
                required
              />
            </div>
            <div className="name-fields">
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={signupData.lastName}
                onChange={handleSignupChange}
                required
              />
            </div>
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={signupData.phoneNumber}
              onChange={handleSignupChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={signupData.email}
              onChange={handleSignupChange}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={signupData.address}
              onChange={handleSignupChange}
              required
            />
            <select
              name="gender"
              value={signupData.gender}
              onChange={handleSignupChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <button type="submit" className="submit-button">Confirm</button>
            <button type="submit" className="submit-button">Login With Gmail</button>
          </form>
        )}
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #1d2b64, #f8cdda);

  .auth-container {
    background: #fff;
    padding: 2rem;
    border-radius: 1rem;
    width: 350px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  }
<<<<<<< HEAD
`;

export default LoginPage;
=======

  .toggle-buttons {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .toggle-buttons button {
    background: none;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-weight: bold;
    color: #333;
    border-bottom: 2px solid transparent;
    transition: 0.3s;
  }

  .toggle-buttons .active {
    color: #1d2b64;
    border-bottom: 2px solid #1d2b64;
  }

  .form {
    display: flex;
    flex-direction: column;
  }

  .form h3 {
    text-align: center;
    margin-bottom: 1rem;
  }

  .form input, .form select {
    margin-bottom: 0.8rem;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
  }

  .submit-button {
    background: #1d2b64;
    color: white;
    padding: 0.7rem;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    margin-top: 0.5rem;
  }

  .submit-button:hover {
    background: #16235a;
  }

  .error {
    color: red;
    text-align: center;
    margin-bottom: 1rem;
  }

  .name-fields {
    display: flex;
    gap: 0.5rem;
  }

  .name-fields input {
    flex: 1;
  }
`;

export default AuthPage;
>>>>>>> boharaWork
