import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import image1 from "./images/addrecipe.jpg";
import images2 from "./images/addrecipe2.jpg";

const AddRecipe = () => {
  const [title, setTitle] = useState(""); // State for recipe title
  const [description, setDescription] = useState(""); // State for recipe description
  const [ingredients, setIngredients] = useState([""]); // State for ingredients
  const [steps, setSteps] = useState([""]); // State for steps
  const [cookingTime, setCookingTime] = useState({ hours: 0, minutes: 0 }); // State for cooking time
  const [difficulty, setDifficulty] = useState(""); // State for difficulty
  const [image, setImage] = useState(null); // State for the image file
  const [error, setError] = useState(null); // State for error message

  const { token } = useSelector((state) => state.auth); // Accessing token from Redux
  const navigate = useNavigate(); // Hook to navigate

  // Redirect to login page if no token is found
  useEffect(() => {
    if (!token) {
      navigate("/login"); // Redirect to login page
    }
  }, [token, navigate]);

  // Add ingredient field
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

  // Add step field
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

  // Handle cooking time change
  const handleCookingTimeChange = (field, value) => {
    setCookingTime((prevTime) => ({
      ...prevTime,
      [field]: value,
    }));
  };

  // Handle file selection
  const handleImageChange = (e) => setImage(e.target.files[0]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (
      !title ||
      !description ||
      !ingredients.length ||
      !steps.length ||
      !difficulty ||
      !image
    ) {
      setError("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("ingredients", JSON.stringify(ingredients));
    formData.append("steps", JSON.stringify(steps));
    formData.append("cookingtime", JSON.stringify(cookingTime));
    formData.append("difficulty", difficulty);
    formData.append("image", image);

    try {
      const response = await fetch("http://localhost:5000/api/addrecipe", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        navigate("/userdashboard"); // Redirect after success
      } else {
        setError(data.message || "Failed to add recipe.");
      }
    } catch (err) {
      setError("Error adding recipe: " + err.message);
    }
  };

  return (
    <div className='d-flex flex-column min-vh-100'>
      <Navbar />
      <div className='container-lg my-5 flex-grow-1 py-4'>
        <div className='shadow rounded bg-white'>
          {/* Top Image */}
          <div>
            <img
              src={image1}
              alt='Add Recipe'
              className='img-fluid w-100 rounded-top'
              style={{ height: "300px", objectFit: "cover" }}
            />
          </div>

          {/* Form Section */}
          <div className='p-4'>
            <h3 className='text-left display-4 mb-4'>Add New Recipe</h3>
            {error && <div className='alert alert-danger'>{error}</div>}
            <form onSubmit={handleSubmit} className='mt-4'>
              {/* Recipe Title */}
              <div className='mb-4'>
                <div className='form-floating'>
                  <input
                    type='text'
                    className='form-control'
                    id='recipeTitle'
                    placeholder='Enter recipe title'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                  <label htmlFor='recipeTitle'>Recipe Title</label>
                </div>
              </div>

              {/* Recipe Description */}
              <div className='mb-4'>
                <div className='form-floating'>
                  <textarea
                    className='form-control'
                    id='recipeDescription'
                    placeholder='Enter a brief description of the recipe'
                    rows='2'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                  <label htmlFor='recipeDescription'>Recipe Description</label>
                </div>
              </div>

              {/* Recipe Image Upload */}
              <div className='mb-4'>
                <label htmlFor='recipeImage' className='form-label fw-bold'>
                  Upload Recipe Image
                </label>
                <input
                  type='file'
                  className='form-control'
                  id='recipeImage'
                  accept='image/*'
                  onChange={handleImageChange}
                  required
                />
              </div>

              {/* Ingredients */}
              <div className='mb-4'>
                <label className='form-label fw-bold'>Ingredients</label>
                {ingredients.map((ingredient, index) => (
                  <div key={index} className='position-relative mb-3'>
                    <input
                      type='text'
                      className='form-control'
                      placeholder={`Ingredient ${index + 1}`}
                      value={ingredient}
                      onChange={(e) =>
                        handleIngredientChange(index, e.target.value)
                      }
                      required
                    />
                    <button
                      type='button'
                      className='btn position-absolute top-50 end-0 translate-middle-y pe-2 text-danger'
                      onClick={() => removeIngredient(index)}
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                      }}
                    >
                      <i className='bi bi-x-circle-fill fs-4'></i>
                    </button>
                  </div>
                ))}
                <button
                  type='button'
                  className='btn btn-outline-primary btn-md'
                  onClick={addIngredient}
                >
                  + Add Ingredient
                </button>
              </div>

              {/* Steps */}
              <div className='mb-4'>
                <label className='form-label fw-bold'>Steps</label>
                {steps.map((step, index) => (
                  <div key={index} className='position-relative mb-3'>
                    <input
                      type='text'
                      className='form-control'
                      placeholder={`Step ${index + 1}`}
                      value={step}
                      onChange={(e) => handleStepChange(index, e.target.value)}
                      required
                    />
                    <button
                      type='button'
                      className='btn position-absolute top-50 end-0 translate-middle-y pe-2 text-danger'
                      onClick={() => removeStep(index)}
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                      }}
                    >
                      <i className='bi bi-x-circle-fill fs-4'></i>
                    </button>
                  </div>
                ))}
                <button
                  type='button'
                  className='btn btn-outline-primary btn-md'
                  onClick={addStep}
                >
                  + Add Step
                </button>
              </div>

              {/* Cooking Time */}
              <div className='row mb-4'>
                <label className='form-label fw-bold'>Cooking Time</label>
                <div className='col-md-6 mb-3 mb-md-0'>
                  <div className='form-floating'>
                    <input
                      type='number'
                      className='form-control'
                      placeholder='Hours'
                      min='0'
                      value={cookingTime.hours}
                      onChange={(e) =>
                        handleCookingTimeChange("hours", e.target.value)
                      }
                      required
                    />
                    <label>Hours</label>
                  </div>
                </div>
                <div className='col-md-6'>
                  <div className='form-floating'>
                    <input
                      type='number'
                      className='form-control'
                      placeholder='Minutes'
                      min='0'
                      value={cookingTime.minutes}
                      onChange={(e) =>
                        handleCookingTimeChange("minutes", e.target.value)
                      }
                      required
                    />
                    <label>Minutes</label>
                  </div>
                </div>
              </div>

              {/* Difficulty Level */}
              <div className='mb-4'>
                <label className='form-label fw-bold'>Difficulty Level</label>
                <div>
                  <div className='form-check form-check-inline mt-3'>
                    <input
                      className='form-check-input'
                      type='radio'
                      id='easy'
                      name='difficulty'
                      value='Easy'
                      onChange={() => setDifficulty("Easy")}
                      required
                    />
                    <label className='form-check-label' htmlFor='easy'>
                      Easy
                    </label>
                  </div>
                  <div className='form-check form-check-inline'>
                    <input
                      className='form-check-input'
                      type='radio'
                      id='medium'
                      name='difficulty'
                      value='Medium'
                      onChange={() => setDifficulty("Medium")}
                      required
                    />
                    <label className='form-check-label' htmlFor='medium'>
                      Medium
                    </label>
                  </div>
                  <div className='form-check form-check-inline'>
                    <input
                      className='form-check-input'
                      type='radio'
                      id='hard'
                      name='difficulty'
                      value='Hard'
                      onChange={() => setDifficulty("Hard")}
                      required
                    />
                    <label className='form-check-label' htmlFor='hard'>
                      Hard
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className='text-center'>
                <button type='submit' className='btn btn-primary'>
                  Submit Recipe
                </button>
              </div>
            </form>
          </div>

          {/* Bottom Image */}
          <div>
            <img
              src={images2}
              alt='Base Recipe'
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

export default AddRecipe;
