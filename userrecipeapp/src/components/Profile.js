import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Pagination from "./Pagination";
import Navbar from "./Navbar";
import Footer from "./Footer";
import profile from "./images/profile.jpg";
import dp from "./images/dp.png";

const Profile = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [recipesPerPage] = useState(6); // Items per page
  const [currentUser, setCurrentUser] = useState(null); // State for user details
  const [userRecipes, setUserRecipes] = useState([]); // State for user's recipes
  const [totalPages, setTotalPages] = useState(0); // State for total pages
  const [showResetForm, setShowResetForm] = useState(false); // State to toggle reset password form
  const { token } = useSelector((state) => state.auth); // Get token from Redux state
  const navigate = useNavigate(); // Navigate hook

  // Fetch user details and recipes from API
  useEffect(() => {
    fetch(
      `http://localhost:5000/api/profile?page=${currentPage}&limit=${recipesPerPage}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        if (response.status === 401) {
          console.error("Unauthorized: Token expired");
          navigate("/login"); // Redirect to login page
          return null; // Stop further processing
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.user) {
          setCurrentUser({
            name: data.user.name,
            email: data.user.email,
          });
          setUserRecipes(data.recipes); // Set paginated recipes
          setTotalPages(data.pagination.totalPages); // Set total pages from backend
        }
      })
      .catch((error) => {
        console.error("Error fetching profile data:", error);
        navigate("/login"); // Redirect on any error
      });
  }, [token, navigate, currentPage, recipesPerPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber); // Update current page
  };

  const handleResetClick = () => {
    setShowResetForm(!showResetForm);
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    const oldPassword = e.target.oldPassword.value;
    const newPassword = e.target.newPassword.value;

    fetch("http://localhost:5000/api/profile/resetpassword", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    })
      .then((response) => {
        if (response.status === 401) {
          console.error("Unauthorized: Token expired");
          navigate("/login");
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.message) {
          alert("Password reset successful");
          setShowResetForm(false);
        } else {
          alert("There was an issue resetting the password. Please try again.");
        }
      })
      .catch((err) => {
        console.error("Error resetting password:", err);
        alert("There was an issue resetting the password. Please try again.");
      });
  };

  const handleDelete = (recipeId) => {
    fetch(`http://localhost:5000/api/deleterecipe/${recipeId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 401) {
          navigate("/login");
          return null;
        }
        if (!response.ok) {
          throw new Error("Failed to delete recipe");
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.message) {
          setUserRecipes((prevRecipes) =>
            prevRecipes.filter((recipe) => recipe._id !== recipeId)
          );
        }
      })
      .catch((error) => {
        console.error("Error deleting recipe:", error);
        alert("There was an issue deleting the recipe. Please try again.");
      });
  };

  return (
    <div>
      <Navbar />
      <div className='hero-section'>
        <img
          src={profile}
          alt='Hero'
          className='img-fluid w-100'
          style={{ objectFit: "cover", height: "300px" }}
        />
      </div>
      <div className='container my-5'>
        <div className='row'>
          <div className='col-lg-4 mb-4'>
            <div className='card shadow-sm'>
              <img
                src={dp}
                alt='Profile'
                className='card-img-top img-fluid w-100'
                style={{ objectFit: "cover", height: "300px" }}
              />
              <div className='card-body'>
                <h5 className='card-title text-center display-5'>Profile</h5>
                <hr />
                {currentUser && (
                  <>
                    <p className='card-text'>
                      <strong>Username:</strong> {currentUser.name}
                    </p>
                    <p className='card-text'>
                      <strong>Email:</strong> {currentUser.email}
                    </p>
                  </>
                )}
                <button
                  className='btn btn-outline-primary mt-3'
                  onClick={handleResetClick}
                >
                  Reset Password
                </button>
                {showResetForm && (
                  <div className='mt-3'>
                    <form onSubmit={handleResetSubmit}>
                      <div className='form-floating mb-3'>
                        <input
                          type='password'
                          className='form-control'
                          id='oldPassword'
                          name='oldPassword'
                          placeholder='Old Password'
                          required
                        />
                        <label htmlFor='oldPassword'>Old Password</label>
                      </div>
                      <div className='form-floating mb-3'>
                        <input
                          type='password'
                          className='form-control'
                          id='newPassword'
                          name='newPassword'
                          placeholder='New Password'
                          required
                        />
                        <label htmlFor='newPassword'>New Password</label>
                      </div>
                      <button type='submit' className='btn btn-primary'>
                        Submit
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='col-lg-8'>
            <h3 className='mb-3 display-4'>My Recipes</h3>
            <hr />
            <div className='row g-4'>
              {userRecipes.map((recipe) => (
                <div key={recipe._id} className='col-12 col-md-6 col-lg-4'>
                  <div className='card shadow-sm mt-3'>
                    <img
                      src={`http://localhost:5000/${recipe.image}`}
                      alt={recipe.title}
                      className='card-img-top'
                      style={{ objectFit: "cover", height: "200px" }}
                    />
                    <div className='card-body'>
                      <h5 className='card-title'>{recipe.title}</h5>
                      <div className='row'>
                        <div className='col-6 text-start'>
                          <span
                            className={`badge ${
                              recipe.difficulty === "Hard"
                                ? "bg-danger"
                                : recipe.difficulty === "Medium"
                                ? "bg-warning"
                                : "bg-success"
                            }`}
                          >
                            {recipe.difficulty}
                          </span>
                        </div>
                        <div className='col-6 text-end'>
                          <div className='d-flex justify-content-end align-items-center'>
                            <i className='bi bi-eye'></i> &ensp;
                            {recipe.viewcount}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='card-footer text-left'>
                      <button
                        className='btn btn-outline-info btn-sm me-3'
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/viewrecipe/${recipe._id}`);
                        }}
                      >
                        View
                      </button>
                      <button
                        className='btn btn-sm btn-outline-primary me-3 mt-2 mb-2'
                        onClick={() => navigate(`/editrecipe/${recipe._id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className='btn btn-sm btn-outline-danger'
                        onClick={() => handleDelete(recipe._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className='d-flex justify-content-center mt-4'>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
