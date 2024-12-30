import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import hero1 from "./images/dash.jpg";
import Pagination from "./Pagination"; // Import Pagination component

const Dashboard = () => {
  const [recipes, setRecipes] = useState([]); // State for fetched recipes
  const [error, setError] = useState(null); // Error state
  const [search, setSearch] = useState(""); // Search input state
  const [currentUser, setCurrentUser] = useState(null); // State to hold logged-in user details
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [totalPages, setTotalPages] = useState(1); // Track total pages

  const { token, user } = useSelector((state) => state.auth); // Redux state for auth
  const navigate = useNavigate(); // Hook to navigate programmatically
  console.log("Logged-in user:", user);

  const fetchUserDetails = useCallback(() => {
    fetch("http://localhost:5000/api/userdetails", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("API Response:", data); // Log the full response to check the structure
        if (data.userId) {
          setCurrentUser({
            _id: data.userId,
            name: data.username,
            email: data.userEmail,
          });
          console.log("Current user details fetched:", data);
        } else {
          console.error("User data not found in the response:", data);
        }
      })
      .catch((err) => {
        console.error("Error fetching user details:", err);
      });
  }, [token]);

  // Fetch recipes from the API with pagination support
  const fetchRecipes = useCallback(
    (searchQuery = "", page = 1) => {
      if (!token) {
        setError("No token found, please log in.");
        navigate("/login");
        return;
      }

      fetch(
        `http://localhost:5000/api/dashboard/allrecipes?search=${searchQuery}&page=${page}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            if (response.status === 401) {
              throw new Error("Session expired. Please log in again.");
            }
            throw new Error("Failed to fetch recipes.");
          }
          return response.json();
        })
        .then((data) => {
          if (Array.isArray(data.recipes)) {
            setRecipes(data.recipes);
            setTotalPages(data.totalPages); // Assuming the API sends totalPages
          } else {
            setRecipes([]);
          }
          setError(null);
        })
        .catch((error) => {
          setError(error.message);
          setRecipes([]);
          if (error.message === "Session expired. Please log in again.") {
            navigate("/login");
          }
        });
    },
    [token, navigate]
  );

  // Initial data fetch
  useEffect(() => {
    fetchUserDetails(); // Fetch current user details
    fetchRecipes(); // Fetch all recipes
  }, [fetchUserDetails, fetchRecipes]);

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to the first page when searching
    fetchRecipes(search, 1); // Fetch recipes for the first page
  };

  // Change page handler
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchRecipes(search, page); // Fetch recipes for the selected page
  };

  // Delete recipe handler
  const handleDelete = (recipeId) => {
    fetch(`http://localhost:5000/api/deleterecipe/${recipeId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to delete the recipe.");
        setRecipes((prevRecipes) =>
          prevRecipes.filter((recipe) => recipe._id !== recipeId)
        );
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <div className='position-relative'>
        <img
          src={hero1}
          alt='Hero Background'
          className='img-fluid w-100'
          style={{ objectFit: "cover", height: "300px" }}
        />
        <div className='position-absolute top-50 start-50 translate-middle w-100'>
          <div className='container'>
            <div className='row justify-content-center text-center text-white'>
              <div className='col-12'>
                <h1 className='display-5 mt-3 mb-3'>
                  Welcome {currentUser?.name || "Guest"}
                </h1>
              </div>
            </div>

            {/* Search Bar */}
            <div className='row justify-content-center'>
              <div className='col-12 col-lg-8 mt-3 mb-4'>
                <form
                  className='position-relative w-100'
                  onSubmit={handleSearch}
                >
                  <input
                    type='text'
                    className='form-control rounded-pill pe-5 fs-1 border-1 text-light'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                  />
                  <button
                    type='submit'
                    className='btn position-absolute top-50 end-0 translate-middle-y rounded-pill me-1'
                  >
                    <i className='bi bi-search fs-3 text-light'></i>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className='container py-5'>
        <h1 className='display-4 mt-4 mb-3'>Recipes</h1>
        <hr className='mb-4' />

        {error && <p className='text-danger'>Error: {error}</p>}

        <div className='row g-4'>
          {recipes.length > 0 ? (
            recipes.map((recipe) => {
              return (
                <div
                  key={recipe._id}
                  className='col-12 col-sm-6 col-md-4 col-lg-3 d-flex align-items-stretch'
                >
                  <div className='card shadow-sm h-100 w-100'>
                    <img
                      src={`http://localhost:5000/${recipe.image}`}
                      className='card-img-top'
                      alt={recipe.title}
                      style={{ objectFit: "cover", height: "200px" }}
                    />
                    <div className='card-body d-flex flex-column'>
                      <h5 className='card-title'>{recipe.title}</h5>
                      <p className='card-text text-truncate'>
                        {recipe.description || "No description available."}
                      </p>
                      <p>
                        Shared by: <strong>{recipe.createdBy}</strong>
                      </p>
                      <div className='d-flex justify-content-between align-items-center'>
                        {/* Difficulty Badge */}
                        <span
                          className={`badge ${
                            recipe.difficulty === "Easy"
                              ? "bg-success"
                              : recipe.difficulty === "Medium"
                              ? "bg-warning"
                              : recipe.difficulty === "Hard"
                              ? "bg-danger"
                              : ""
                          }`}
                        >
                          {recipe.difficulty}
                        </span>

                        {/* View Icon and Count */}
                        <div className='d-flex align-items-center'>
                          <i className='bi bi-eye'></i>
                          {/* Eye Icon */}
                          <span>&ensp;{recipe.viewcount}</span>{" "}
                          {/* View Count */}
                        </div>
                      </div>
                    </div>

                    {/* Only show View button for logged-in users */}
                    {currentUser && (
                      <div className='card-footer d-flex justify-content-start gap-2'>
                        <button
                          className='btn btn-outline-info btn-sm'
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card click event
                            navigate(`/viewrecipe/${recipe._id}`); // Navigate to the recipe details page
                          }}
                        >
                          View
                        </button>

                        {/* Only show Edit and Delete buttons if currentUser._id matches the recipe's createdBy */}
                        {currentUser._id &&
                          String(currentUser._id) ===
                            String(recipe.createdByUserId) && (
                            <>
                              <button
                                className='btn btn-outline-success btn-sm'
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent card click event
                                  navigate(`/editrecipe/${recipe._id}`);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className='btn btn-outline-danger btn-sm'
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent card click event
                                  handleDelete(recipe._id);
                                }}
                              >
                                Delete
                              </button>
                            </>
                          )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className='text-center'>No recipes found.</p>
          )}
        </div>

        <div className='mt-4'>
          {/* Pagination Component */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
