import React from "react";
import accordion from "./images/accordion.jpg";

function Accordion() {
  return (
    <div className='container-fluid faq-section pb-5 mt-5'>
      <div className='container pb-5 overflow-hidden'>
        <div className='text-center mx-auto pb-5' style={{ maxWidth: "800px" }}>
          <h4 className='text-primary'>FAQs</h4>
          <h1 className='display-5 mb-4'>Frequently Asked Questions</h1>
          <p className='mb-0'>
            Welcome to the Recipe Sharing App! Here, you can share your favorite
            recipes and discover new ones from other users. Below are some
            common questions to help you get started.
          </p>
        </div>

        <div className='row g-5 align-items-center'>
          <div className='col-lg-6'>
            <div
              className='accordion accordion-flush bg-light rounded p-5'
              id='accordionFlushSection'
            >
              <div className='accordion-item rounded-top'>
                <h2 className='accordion-header' id='flush-headingOne'>
                  <button
                    className='accordion-button collapsed rounded-top'
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target='#flush-collapseOne'
                    aria-expanded='false'
                    aria-controls='flush-collapseOne'
                  >
                    How Do I Share a Recipe on the App?
                  </button>
                </h2>
                <div
                  id='flush-collapseOne'
                  className='accordion-collapse collapse'
                  aria-labelledby='flush-headingOne'
                  data-bs-parent='#accordionFlushSection'
                >
                  <div className='accordion-body'>
                    To share a recipe, simply log in, navigate to the 'Add
                    Recipe' section, and fill in the recipe name, ingredients,
                    instructions, and upload an image. After submitting, your
                    recipe will be visible to others on the app!
                  </div>
                </div>
              </div>

              <div className='accordion-item'>
                <h2 className='accordion-header' id='flush-headingTwo'>
                  <button
                    className='accordion-button collapsed'
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target='#flush-collapseTwo'
                    aria-expanded='false'
                    aria-controls='flush-collapseTwo'
                  >
                    How Can I Edit or Delete My Recipe?
                  </button>
                </h2>
                <div
                  id='flush-collapseTwo'
                  className='accordion-collapse collapse'
                  aria-labelledby='flush-headingTwo'
                  data-bs-parent='#accordionFlushSection'
                >
                  <div className='accordion-body'>
                    After posting a recipe, you can always go back to your
                    recipe page to edit the title, ingredients, or instructions.
                    If you want to delete a recipe, simply click the 'Delete'
                    button on the recipe page.
                  </div>
                </div>
              </div>

              <div className='accordion-item'>
                <h2 className='accordion-header' id='flush-headingThree'>
                  <button
                    className='accordion-button collapsed'
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target='#flush-collapseThree'
                    aria-expanded='false'
                    aria-controls='flush-collapseThree'
                  >
                    How Can I Search for Recipes?
                  </button>
                </h2>
                <div
                  id='flush-collapseThree'
                  className='accordion-collapse collapse'
                  aria-labelledby='flush-headingThree'
                  data-bs-parent='#accordionFlushSection'
                >
                  <div className='accordion-body'>
                    You can search for recipes by entering keywords in the
                    search bar. This can include recipe titles, ingredients, or
                    even specific cooking techniques. You can also filter
                    recipes by categories such as 'Vegan', 'Desserts', etc.
                  </div>
                </div>
              </div>

              <div className='accordion-item'>
                <h2 className='accordion-header' id='flush-headingFour'>
                  <button
                    className='accordion-button collapsed'
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target='#flush-collapseFour'
                    aria-expanded='false'
                    aria-controls='flush-collapseFour'
                  >
                    Is There a Limit to the Number of Recipes I Can Share?
                  </button>
                </h2>
                <div
                  id='flush-collapseFour'
                  className='accordion-collapse collapse'
                  aria-labelledby='flush-headingFour'
                  data-bs-parent='#accordionFlushSection'
                >
                  <div className='accordion-body'>
                    Currently, there is no limit to the number of recipes you
                    can share. You can keep adding as many recipes as you'd like
                    and make your recipe collection grow!
                  </div>
                </div>
              </div>

              <div className='accordion-item'>
                <h2 className='accordion-header' id='flush-headingFive'>
                  <button
                    className='accordion-button collapsed'
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target='#flush-collapseFive'
                    aria-expanded='false'
                    aria-controls='flush-collapseFive'
                  >
                    Can I View Recipes Shared by Other Users?
                  </button>
                </h2>
                <div
                  id='flush-collapseFive'
                  className='accordion-collapse collapse'
                  aria-labelledby='flush-headingFive'
                  data-bs-parent='#accordionFlushSection'
                >
                  <div className='accordion-body'>
                    Yes, you can view recipes shared by other users in the
                    'Browse Recipes' section. You can also like, comment, and
                    share recipes with others.
                  </div>
                </div>
              </div>

              <div className='accordion-item rounded-bottom'>
                <h2 className='accordion-header' id='flush-headingSix'>
                  <button
                    className='accordion-button collapsed'
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target='#flush-collapseSix'
                    aria-expanded='false'
                    aria-controls='flush-collapseSix'
                  >
                    How Do I Create an Account on the App?
                  </button>
                </h2>
                <div
                  id='flush-collapseSix'
                  className='accordion-collapse collapse'
                  aria-labelledby='flush-headingSix'
                  data-bs-parent='#accordionFlushSection'
                >
                  <div className='accordion-body'>
                    To create an account, click on the 'Sign Up' button, provide
                    your email, create a password, and fill out your profile
                    information. Once you're signed up, you can start sharing
                    your recipes and exploring others!
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='col-lg-6'>
            <div className='bg-primary rounded'>
              <img
                src={accordion}
                className='img-fluid w-100 rounded'
                alt='Recipe'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Accordion;
