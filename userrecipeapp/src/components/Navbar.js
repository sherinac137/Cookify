import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeUser } from "../store/authSlice";
import { useSelector } from "react-redux"; // To check if the user is logged in

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get authentication state (checking if user is logged in)
  const { token } = useSelector((state) => state.auth); // Assuming token indicates logged-in status

  function handleLogout() {
    dispatch(removeUser());
    navigate("/login");
  }

  return (
    <nav className='navbar navbar-expand-lg bg-body-tertiary'>
      <div className='container-fluid'>
        <a className='navbar-brand' href='/'>
          Cookify
        </a>
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarSupportedContent'
          aria-controls='navbarSupportedContent'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarSupportedContent'>
          <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
            <li className='nav-item'>
              <a
                className='nav-link active'
                aria-current='page'
                href='/userdashboard'
              >
                Dashboard
              </a>
            </li>
            <li className='nav-item'>
              <a className='nav-link' href='/addrecipe'>
                Add Recipe
              </a>
            </li>
            <li className='nav-item'>
              <a className='nav-link' href='/profile'>
                Profile
              </a>
            </li>
          </ul>
          <ul className='navbar-nav ms-auto mb-2 mb-lg-0'>
            {/* Conditionally render Logout button based on user authentication */}
            {token && (
              <li className='nav-item'>
                <a className='nav-link' href='/#' onClick={handleLogout}>
                  <i className='bi bi-box-arrow-right'></i> Logout
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
