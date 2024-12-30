import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import image1 from "./images/addrecipe.jpg";
import image2 from "./images/addrecipe2.jpg";

const EditRecipe = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState([""]);
  const [cookingTime, setCookingTime] = useState({ hours: 0, minutes: 0 });
  const [difficulty, setDifficulty] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);

  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { id } = useParams(); // Extract recipe ID from URL params

  // Redirect to login if token is not found
  useEffect(() => {
    if (!token) {
      navigate("/login"); // Navigate to login page if no token
    }
  }, [token, navigate]);

  // Fetch existing recipe data
  useEffect(() => {
    if (token) {
      const fetchRecipe = async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/api/viewrecipe/${id}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await response.json();
          if (response.ok) {
            const {
              title,
              description,
              ingredients,
              steps,
              cookingtime,
              difficulty,
            } = data.recipe;
            setTitle(title);
            setDescription(description);
            setIngredients(ingredients);
            setSteps(steps);
            setCookingTime(cookingtime);
            setDifficulty(difficulty);
          } else {
            setError(data.message || "Failed to fetch recipe.");
          }
        } catch (err) {
          setError("Error fetching recipe: " + err.message);
        }
      };

      fetchRecipe();
    }
  }, [id, token]);

  // Update recipe handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !title ||
      !description ||
      !ingredients.length ||
      !steps.length ||
      !difficulty
    ) {
      setError("All fields except the image are required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("ingredients", JSON.stringify(ingredients)); // Serialize ingredients as JSON
    formData.append("steps", JSON.stringify(steps)); // Serialize steps as JSON
    formData.append("cookingtime", JSON.stringify(cookingTime)); // Serialize cookingtime as JSON
    formData.append("difficulty", difficulty);

    if (image) {
      formData.append("image", image); // Include image if provided
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/editrecipe/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        navigate("/userdashboard");
      } else {
        setError(data.message || "Failed to update recipe.");
        console.log(data); // Log full error response from backend
      }
    } catch (err) {
      setError("Error updating recipe: " + err.message);
      console.error(err);
    }
  };

  // Ingredient handlers
  const addIngredient = () => setIngredients([...ingredients, ""]);
  const handleIngredientChange = (index, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = value;
    setIngredients(updatedIngredients);
  };
  const removeIngredient = (index) => {
    const updatedIngredients = ingredients.filter((_, idx) => idx !== index);
    setIngredients(updatedIngredients);
  };

  // Step handlers
  const addStep = () => setSteps([...steps, ""]);
  const handleStepChange = (index, value) => {
    const updatedSteps = [...steps];
    updatedSteps[index] = value;
    setSteps(updatedSteps);
  };
  const removeStep = (index) => {
    const updatedSteps = steps.filter((_, idx) => idx !== index);
    setSteps(updatedSteps);
  };

  // Cooking time handler
  const handleCookingTimeChange = (field, value) => {
    setCookingTime((prev) => ({ ...prev, [field]: value }));
  };

  // Image upload handler
  const handleImageChange = (e) => setImage(e.target.files[0]);

  return (
    <div className='d-flex flex-column min-vh-100'>
      <Navbar />
      <div className='container-lg my-5 flex-grow-1 py-4'>
        <div className='shadow rounded bg-white'>
          <div>
            <img
              src={image1}
              alt='Edit Recipe'
              className='img-fluid w-100 rounded-top'
              style={{ height: "300px", objectFit: "cover" }}
            />
          </div>

          <div className='p-4'>
            <h3 className='text-left display-4 mb-4'>Edit Recipe</h3>
            {error && <div className='alert alert-danger'>{error}</div>}
            <form onSubmit={handleSubmit} className='mt-4'>
              <div className='form-floating mb-4'>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Recipe Title'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label>Recipe Title</label>
              </div>

              <div className='form-floating mb-4'>
                <textarea
                  className='form-control'
                  placeholder='Description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ height: "100px" }}
                ></textarea>
                <label>Description</label>
              </div>

              <div className='mb-4'>
                <label className='form-label fw-bold'>Ingredients</label>
                {ingredients.map((ingredient, index) => (
                  <div key={index} className='d-flex mb-2'>
                    <div className='position-relative w-100'>
                      <input
                        type='text'
                        className='form-control pe-5' // Add padding to the right to accommodate the icon
                        value={ingredient}
                        onChange={(e) =>
                          handleIngredientChange(index, e.target.value)
                        }
                      />
                      <button
                        type='button'
                        className='btn btn-link position-absolute top-50 end-0 translate-middle-y'
                        style={{
                          fontSize: "1.5rem",
                          color: "#dc3545",
                          border: "none",
                          background: "transparent",
                        }}
                        onClick={() => removeIngredient(index)}
                      >
                        <i className='bi bi-x-circle-fill fs-4'></i>{" "}
                        {/* The icon */}
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type='button'
                  className='btn btn-outline-primary'
                  onClick={addIngredient}
                >
                  + Add Ingredient
                </button>
              </div>

              <div className='mb-4'>
                <label className='form-label fw-bold'>Steps</label>
                {steps.map((step, index) => (
                  <div key={index} className='d-flex mb-2'>
                    <div className='position-relative w-100'>
                      <input
                        type='text'
                        className='form-control pe-5' // Add padding to the right to accommodate the icon
                        value={step}
                        onChange={(e) =>
                          handleStepChange(index, e.target.value)
                        }
                      />
                      <button
                        type='button'
                        className='btn btn-link position-absolute top-50 end-0 translate-middle-y'
                        style={{
                          fontSize: "1.5rem",
                          color: "#dc3545",
                          border: "none",
                          background: "transparent",
                        }}
                        onClick={() => removeStep(index)}
                      >
                        <i className='bi bi-x-circle-fill fs-4'></i>{" "}
                        {/* The icon */}
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type='button'
                  className='btn btn-outline-primary'
                  onClick={addStep}
                >
                  + Add Step
                </button>
              </div>

              <div className='mb-4'>
                <label>Cooking Time</label>
                <div className='d-flex'>
                  <input
                    type='number'
                    className='form-control me-2'
                    placeholder='Hours'
                    value={cookingTime.hours}
                    onChange={(e) =>
                      handleCookingTimeChange("hours", e.target.value)
                    }
                  />
                  <input
                    type='number'
                    className='form-control'
                    placeholder='Minutes'
                    value={cookingTime.minutes}
                    onChange={(e) =>
                      handleCookingTimeChange("minutes", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className='mb-4'>
                <label>Upload New Image</label>
                <input
                  type='file'
                  className='form-control'
                  onChange={handleImageChange}
                />
              </div>

              <div className='text-center'>
                <button type='submit' className='btn btn-primary'>
                  Update Recipe
                </button>
              </div>
            </form>
          </div>

          <div>
            <img
              src={image2}
              alt='Base'
              className='img-fluid w-100 rounded-bottom'
              style={{ height: "100px", objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditRecipe;
