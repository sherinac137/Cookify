import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/authSlice";
import "./login.css";
import modal1 from "../images/login.jpg";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Attempt login with validation
  function attemptLogin() {
    // Clear error message before each attempt
    setErrorMessage("");

    // Simple client-side validation for empty fields
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    axios
      .post("http://localhost:5000/api/login", { email, password })
      .then((response) => {
        const { token, message, isAdmin } = response.data;

        // Handle blocked user
        if (message === "Your account is blocked") {
          setErrorMessage("Your account is blocked. Please contact support.");
          return;
        }

        // Clear error message on success
        setErrorMessage("");

        //Handle Admin login
        if (isAdmin) {
          window.location.href = "http://localhost:5000/admin-login";
        } else {
          dispatch(setUser({ token, user: { email } }));
          console.log("Token:", token);
          navigate("/userdashboard");
        }
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          // Display error message returned by the backend
          setErrorMessage(error.response.data.message || "Login failed");
        } else {
          setErrorMessage(
            "Failed to connect to the server. Please try again later."
          );
        }
      });
  }

  return (
    <div className='login-card-container d-flex justify-content-center align-items-center'>
      <div className='card shadow-lg' style={{ width: "30rem" }}>
        {/* Card Header with Image */}
        <div className='position-relative'>
          <img
            src={modal1}
            className='card-img-top w-100 rounded shadow'
            alt='Login Banner'
            style={{ height: "200px", objectFit: "cover" }}
          />
        </div>

        {/* Card Body */}
        <div className='card-body'>
          <h5 className='card-title text-center display-6 mt-3 mb-4'>Login</h5>

          {/* Alert for Errors */}
          {errorMessage && (
            <div
              className='alert alert-danger alert-dismissible fade show'
              role='alert'
            >
              {errorMessage}
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='alert'
                aria-label='Close'
                onClick={() => setErrorMessage("")}
              ></button>
            </div>
          )}

          {/* Email Input */}
          <div className='mb-3'>
            <div className='form-floating'>
              <input
                type='email'
                className='form-control'
                id='email'
                placeholder='Enter your email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor='email'>Email Address</label>
            </div>
          </div>

          {/* Password Input */}
          <div className='mb-3'>
            <div className='form-floating'>
              <input
                type='password'
                className='form-control'
                id='password'
                placeholder='Enter your password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor='password'>Password</label>
            </div>
          </div>

          {/* Login Button */}
          <button className='btn btn-primary w-100 mb-3' onClick={attemptLogin}>
            Login
          </button>
        </div>

        {/* Card Footer */}
        <div className='card-footer text-center'>
          <p>
            New here?{" "}
            <Link to='/signup' className='text-primary'>
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
