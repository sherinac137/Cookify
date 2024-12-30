import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux"; // Using Redux to get auth state
import carousel1 from "./images/food-header.jpg";
import carousel2 from "./images/carousel2.jpg";

function Carousel() {
  // Get auth state from Redux (assuming token or user is in auth state)
  const { token } = useSelector((state) => state.auth);

  return (
    <div className='container-fluid position-relative p-0'>
      {/* Carousel */}
      <div
        id='recipeCarousel'
        className='carousel slide'
        data-bs-ride='carousel'
      >
        <div className='carousel-inner'>
          {/* Slide 1 */}
          <div className='carousel-item active'>
            <img src={carousel1} className='d-block w-100' alt='...' />
            <div className='carousel-caption d-flex flex-column justify-content-center align-items-center text-center px-3'>
              <h1 className='text-white mt-3 mb-3 display-4 display-md-3'>
                Discover New Recipes
              </h1>
              <p className='text-white mb-4 fs-5'>
                Explore hundreds of mouth-watering recipes and share your own
                recipes
              </p>
              <div className='d-flex flex-wrap justify-content-center gap-2'>
                {/* Conditionally render buttons based on if user is logged in */}
                {!token && (
                  <>
                    <Link
                      to='/signup'
                      className='btn btn-primary rounded-pill px-4 py-2'
                    >
                      Signup
                    </Link>
                    <Link
                      to='/login'
                      className='btn btn-outline-light rounded-pill px-4 py-2'
                    >
                      Login
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Slide 2 */}
          <div className='carousel-item'>
            <img src={carousel2} className='d-block w-100' alt='...' />
            <div className='carousel-caption d-flex flex-column justify-content-center align-items-center text-center px-3'>
              <h1 className='text-white mt-3 mb-3 display-4 display-md-3'>
                Share Your Recipes
              </h1>
              <p className='text-white mb-4 fs-5'>
                Create an account and start sharing your favorite recipes today
              </p>
              <div className='d-flex flex-wrap justify-content-center gap-2'>
                <a
                  href='#recipes'
                  className='btn btn-primary rounded-pill px-4 py-2'
                >
                  Explore
                </a>
                <a
                  href='#learnmore'
                  className='btn btn-outline-light rounded-pill px-4 py-2'
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Previous Button */}
        <button
          className='carousel-control-prev'
          type='button'
          data-bs-target='#recipeCarousel'
          data-bs-slide='prev'
        >
          <i
            className='bi bi-arrow-left-circle-fill text-primary'
            style={{ fontSize: "4rem" }}
          ></i>
        </button>

        {/* Next Button */}
        <button
          className='carousel-control-next'
          type='button'
          data-bs-target='#recipeCarousel'
          data-bs-slide='next'
        >
          <i
            className='bi bi-arrow-right-circle-fill text-primary'
            style={{ fontSize: "4rem" }}
          ></i>
        </button>
      </div>
    </div>
  );
}

export default Carousel;
