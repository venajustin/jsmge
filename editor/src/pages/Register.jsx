import { useState } from 'react';
import { useParallax } from '../hooks/useParallax';
import '../index.css';

const Register = () => {
  useParallax()

  const [emailError, setEmailError] = useState('');

  const validateEmail = (email) => {
    // Check for @ and . in the email
    if (!email.includes('@') || !email.includes('.')) {
      return false;
    }

    // Basic format check: something@something.something
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const email = formData.get('Email');
  const username = formData.get('username');
  const password = formData.get('password');

  // Check if any field is empty
  if (!email.trim() || !username.trim() || !password.trim()) {
    setEmailError('All fields are required.');
    return;
  }

  // Validate email format
  if (!validateEmail(email)) {
    setEmailError('Please enter a valid email address.');
    return;
  }

  // Clear error if validation passes
  setEmailError('');

  // Your registration logic here
  alert("Registration submitted!");
  };

  const handleEmailChange = () => {
    // Clear error when user starts typing
    if (emailError) {
      setEmailError('');
    }
  };

  return (
    <>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Jersey+10&display=swap" rel="stylesheet"></link>
      </head>
      <div className="home-container">
        <div className="title-group">
          <h2 className='titleWhite'>Welcome to</h2>
          <h1 className='projTitle'>
            <span className='colorBlue'>J</span>
            <span className='colorBlue'>S</span>
            <span className='colorRed'>M</span>
            <span className='colorYellow'>G</span>
            <span className='colorYellow'>E</span>
          </h1>
        </div>
        <div className="card home-container">
          <form
            className="register-form"
            onSubmit={handleSubmit}
            noValidate /*Override validation to input our custom one*/
          >
            <div style={{marginBottom: "10px"}}>
              {emailError && (
                <div className="error-message">
                  {emailError}
                </div>
              )}
              <input
                type="email"
                placeholder="John@email.com"
                name="Email"
                className="custom-input"
                required
                onChange={handleEmailChange}
                style={{ width: "100%", padding: "8px" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <input
                type="text"
                placeholder="Username"
                name="username"
                className="custom-input"
                required
                style={{ width: "100%", padding: "8px" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <input
                type="password"
                placeholder="Password"
                name="password"
                className="custom-input"
                required
                style={{ width: "100%", padding: "8px" }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button className='custom-button' type="submit">
                Register
              </button>
            </div>
          </form>
          <br />
          <button className='custom-button items-centered'>
            Login
          </button>
        </div>
      </div>
    </>
  );
};

export default Register;