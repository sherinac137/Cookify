import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useSelector } from "react-redux"; // To get the token from Redux
import { useNavigate } from "react-router-dom";

const ViewRecipe = () => {
  const { id } = useParams(); // Get recipe ID from the URL
  const [recipe, setRecipe] = useState(null); // State for storing the recipe data
  const [error, setError] = useState(null); // Error state for handling failed requests
  const { token } = useSelector((state) => state.auth); // Get the token from Redux
  const navigate = useNavigate(); // To navigate programmatically in case of an error

  // Function to format cooking time from { hours, minutes }
  const formatCookingTime = (cookingTime) => {
    if (!cookingTime) return "N/A";
    const { hours, minutes } = cookingTime;
    let formattedTime = "";
    if (hours) {
      formattedTime += `${hours} hour${hours > 1 ? "s" : ""}`;
    }
    if (minutes) {
      if (formattedTime) formattedTime += " "; // Add space if both hours and minutes exist
      formattedTime += `${minutes} minute${minutes > 1 ? "s" : ""}`;
    }
    return formattedTime || "N/A"; // If no hours or minutes, return "N/A"
  };

  useEffect(() => {
    // Check if the token exists
    if (!token) {
      setError("You need to be logged in to view the recipe.");
      navigate("/login"); // Navigate to login page if no token is found
      return;
    }

    // Fetch recipe details from the API
    fetch(`http://localhost:5000/api/viewrecipe/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the request headers
      },
    })
      .then((response) => {
        if (response.status === 401) {
          // If the server responds with a 401 error (Unauthorized), redirect to login
          navigate("/login");
          throw new Error("Unauthorized access. Please log in.");
        }

        if (!response.ok) {
          throw new Error("Failed to fetch recipe.");
        }

        return response.json();
      })
      .then((data) => {
        // Parse the cookingtime if it comes as a string
        if (
          data.recipe.cookingtime &&
          typeof data.recipe.cookingtime === "string"
        ) {
          data.recipe.cookingtime = JSON.parse(data.recipe.cookingtime);
        }
        setRecipe(data.recipe); // Store the recipe data in the state
      })
      .catch((err) => {
        setError(err.message); // Set the error if any
        console.error("Error fetching recipe:", err);
        // Optionally, navigate to an error page or a fallback
        navigate("/dashboard");
      });
  }, [id, token, navigate]);

  if (error) {
    return <p className='text-danger text-center'>Error: {error}</p>;
  }

  if (!recipe) {
    return <p className='text-center'>Loading...</p>; // Show loading until data is fetched
  }

  // Dynamically set the difficulty class based on recipe.difficulty
  const difficultyClass =
    recipe.difficulty === "Easy"
      ? "bg-success"
      : recipe.difficulty === "Medium"
      ? "bg-warning"
      : recipe.difficulty === "Hard"
      ? "bg-danger"
      : "";

  return (
    <div>
      <Navbar />
      <div className='container my-5 py-5'>
        <div
          className='row g-0 align-items-stretch shadow rounded overflow-hidden recipe-card'
          style={{ background: "#fff" }}
        >
          {/* Recipe Image */}
          <div className='col-lg-6'>
            <img
              src={`http://localhost:5000/${recipe.image}`} // Assuming image path is stored in the recipe object
              className='img-fluid w-100'
              alt={recipe.title}
              style={{ objectFit: "cover", height: "100%" }} // Image will cover the container without distortion
            />
          </div>

          {/* Recipe Details */}
          <div className='col-lg-6 p-4 d-flex flex-column'>
            <div className='d-flex justify-content-between align-items-center'>
              <h1 className='display-4 mb-4'>{recipe.title}</h1>

              {/* View count */}
              <div className='d-flex align-items-center'>
                <i
                  className='bi bi-eye text-primary'
                  style={{ fontSize: "2rem" }}
                ></i>
                <span className='ms-2 ' style={{ fontSize: "1.4rem" }}>
                  {recipe.viewcount}
                </span>
              </div>
            </div>

            {/* Description */}
            {recipe.description && (
              <p className='lead mb-4'>{recipe.description}</p>
            )}

            <div className='d-flex gap-3 mb-4'>
              <button className='btn btn-success' style={{ minWidth: "150px" }}>
                <strong>Cooking Time:</strong>{" "}
                {formatCookingTime(recipe.cookingtime)}
              </button>
              <button
                className={`btn text-light ${difficultyClass}`}
                style={{ minWidth: "150px" }}
              >
                <strong>Difficulty Level:</strong> {recipe.difficulty || "N/A"}
              </button>
            </div>

            <hr />
            <h3>Ingredients</h3>
            <ul className='list-group mb-4'>
              {recipe.ingredients?.map((ingredient, index) => (
                <li key={index} className='list-group-item'>
                  {ingredient}
                </li>
              ))}
            </ul>
            <hr />
            <h3>Steps</h3>
            <ol className='list-group list-group-numbered'>
              {recipe.steps?.map((step, index) => (
                <li key={index} className='list-group-item'>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ViewRecipe;
