import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./login.css";
import signup from "../images/signup.jpg";

function Signup() {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState([]);
  const navigate = useNavigate();

  function SignupUser() {
    if (password !== confirmPassword) {
      setErrorMessage(["Passwords do not match!"]);
      return;
    }

    const user = {
      name: name,
      email: email,
      password: password,
      password_conf: confirmPassword,
    };

    axios
      .post("http://localhost:5000/api/signup", user)
      .then(() => {
        setErrorMessage([]);
        navigate("/");
      })
      .catch((err) => {
        if (err.response?.data?.errors) {
          const errorArray = Object.values(err.response.data.errors);
          setErrorMessage(errorArray);
        } else if (err.response?.data.message) {
          setErrorMessage([err.response.data.message]);
        } else {
          setErrorMessage(["Failed to connect to Server"]);
        }
      });
  }

  return (
    <div className='signup-card-container d-flex justify-content-center align-items-center shadow'>
      <div className='card shadow-lg' style={{ width: "30rem" }}>
        {/* Header with Image */}
        <div className='position-relative'>
          <img
            src={signup}
            className='card-img-top rounded'
            alt='Signup Banner'
            style={{ height: "200px", objectFit: "cover" }}
          />
        </div>

        {/* Body */}
        <div className='card-body'>
          <h5 className='card-title text-center display-6 mt-3 mb-4'>Signup</h5>

          {/* Alert for Validation Errors */}
          {errorMessage.length > 0 && (
            <div
              className='alert alert-danger alert-dismissible fade show'
              role='alert'
            >
              <ul className='mb-0'>
                {errorMessage.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='alert'
                aria-label='Close'
                onClick={() => setErrorMessage([])}
              ></button>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              SignupUser();
            }}
          >
            {/* Name Input */}
            <div className='mb-3 form-floating'>
              <input
                type='text'
                className='form-control'
                id='name'
                placeholder='Enter your name'
                value={name}
                onInput={(e) => setname(e.target.value)}
              />
              <label htmlFor='name'>Full Name</label>
            </div>

            {/* Email Input */}
            <div className='mb-3 form-floating'>
              <input
                type='email'
                className='form-control'
                id='email'
                placeholder='Enter your email'
                value={email}
                onInput={(e) => setemail(e.target.value)}
              />
              <label htmlFor='email'>Email Address</label>
            </div>

            {/* Password Input */}
            <div className='mb-3 form-floating'>
              <input
                type='password'
                className='form-control'
                id='password'
                placeholder='Enter your password'
                value={password}
                onInput={(e) => setPassword(e.target.value)}
              />
              <label htmlFor='password'>Password</label>
            </div>

            {/* Confirm Password Input */}
            <div className='mb-3 form-floating'>
              <input
                type='password'
                className='form-control'
                id='confirmPassword'
                placeholder='Confirm your password'
                value={confirmPassword}
                onInput={(e) => setConfirmPassword(e.target.value)}
              />
              <label htmlFor='confirmPassword'>Confirm Password</label>
            </div>

            {/* Signup Button */}
            <button type='submit' className='btn btn-primary w-100 mb-3'>
              Signup
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className='card-footer text-center'>
          <p>
            Already have an account?{" "}
            <Link to='/login' className='text-primary'>
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
