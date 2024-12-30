import React from "react";
import services1 from "./images/services1.jpg";
import services2 from "./images/services2.jpg";
import services3 from "./images/services3.jpg";

function Services() {
  return (
    <div className='container-fluid service pb-5 mt-5'>
      <div className='container pb-5'>
        {/* Header Section */}
        <div className='text-center mx-auto pb-5' style={{ maxWidth: "800px" }}>
          <h4 className='text-primary'>Our Services</h4>
          <h1 className='display-5 mb-4'>We Provide the Best Offers</h1>
          <p className='mb-0'>
            Discover our range of services designed to bring you the best
            solutions. From strategy consulting to management, we ensure your
            goals are met efficiently and effectively.
          </p>
        </div>

        {/* Services Cards */}
        <div className='row g-4'>
          {/* Card 1 */}
          <div className='col-md-4'>
            <div className='service-item card shadow-sm border-0 h-100 d-flex flex-column'>
              <div className='service-img'>
                <img
                  src={services1}
                  className='img-fluid rounded-top w-100'
                  alt='Strategy Consulting'
                />
              </div>
              <div className='rounded-bottom p-4 mt-auto'>
                <h4 className='d-inline-block mb-4'>Recipe Sharing</h4>
                <p className='card-text'>
                  Share your favorite recipes with the world and discover new
                  ones from fellow food lovers.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className='col-md-4'>
            <div className='service-item card shadow-sm border-0 h-100 d-flex flex-column'>
              <div className='service-img'>
                <img
                  src={services2}
                  className='img-fluid rounded-top w-100'
                  alt='Financial Advisory'
                />
              </div>
              <div className='rounded-bottom p-4 mt-auto'>
                <h4 className='d-inline-block mb-4'>Add Recipe</h4>
                <p className='card-text'>
                  Add recipes to the application and share your culinary recipe
                  creations!
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className='col-md-4'>
            <div className='service-item card shadow-sm border-0 h-100 d-flex flex-column'>
              <div className='service-img'>
                <img
                  src={services3}
                  className='img-fluid rounded-top w-100'
                  alt='Management Services'
                />
              </div>
              <div className='rounded-bottom p-4 mt-auto'>
                <h4 className='d-inline-block mb-4'>Profile</h4>
                <p className='card-text'>
                  Add recipes to the application and share your culinary recipe
                  creations!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;
