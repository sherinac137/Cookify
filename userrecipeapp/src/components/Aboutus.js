import React from "react";
import aboustus from "./images/aboutus.jpg";

function AboutUs() {
  return (
    <div className='container-fluid about py-5 mt-5'>
      <div className='container py-5'>
        <div className='row g-5 align-items-center'>
          <div className='col-xl-7'>
            <div>
              <h4 className='text-primary'>About Us</h4>
              <h1 className='display-5 mb-4'>
                Meet Our Recipe Sharing Community
              </h1>
              <p className='mb-4'>
                Welcome to our Recipe Sharing App! We provide a platform where
                cooking enthusiasts can share their favorite recipes, discover
                new dishes, and connect with fellow food lovers.
              </p>
              <div className='row g-4'>
                <div className='col-md-6'>
                  <div className='d-flex'>
                    <div>
                      <i className='bi bi-cup-straw fa-3x text-primary fs-4'></i>
                    </div>
                    <div className='ms-4'>
                      <h4>Recipe Sharing</h4>
                      <p>
                        Share your best recipes with the community and explore
                        others' creations.
                      </p>
                    </div>
                  </div>
                </div>
                <div className='col-md-6'>
                  <div className='d-flex'>
                    <div>
                      <i className='bi bi-people-fill fa-3x text-primary fs-4'></i>
                    </div>
                    <div className='ms-4'>
                      <h4>Community Engagement</h4>
                      <p>
                        Connect with other users, comment on recipes, and get
                        inspired by the food community.
                      </p>
                    </div>
                  </div>
                </div>
                <div className='col-sm-6'>
                  <a
                    href='#recipe'
                    className='btn btn-primary rounded-pill py-3 px-5'
                  >
                    Discover Recipes
                  </a>
                </div>
                <div className='col-sm-6'>
                  <div className='d-flex'>
                    <i className='bi bi-telephone-fill fa-2x text-primary me-4 fs-4'></i>
                    <div>
                      <h4>Contact Us</h4>
                      <p className='mb-0 fs-5' style={{ letterSpacing: "1px" }}>
                        +91 234567890
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-xl-5'>
            <div className='bg-primary rounded position-relative overflow-hidden'>
              <img
                src={aboustus}
                className='img-fluid rounded w-100 shadow'
                alt='Delicious recipe'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
