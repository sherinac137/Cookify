import React from "react";

function Footer() {
  return (
    <footer className='footer  text-white py-3'>
      <div className='container text-center'>
        <h4 className='text-white'>
          <i className='bi bi-clipboard-check me-2'></i>Recipe App
        </h4>
        <p className='small'>&copy; 2024 Recipe App. All Rights Reserved.</p>
        <div className='d-flex justify-content-center flex-wrap'>
          <a
            href='#facebook'
            className='me-3 text-white text-decoration-none mb-2 mb-sm-0'
          >
            <i className='bi bi-facebook fs-5'></i>
          </a>
          <a
            href='#twitter'
            className='me-3 text-white text-decoration-none mb-2 mb-sm-0'
          >
            <i className='bi bi-twitter fs-5'></i>
          </a>
          <a
            href='#instagram'
            className='me-3 text-white text-decoration-none mb-2 mb-sm-0'
          >
            <i className='bi bi-instagram fs-5'></i>
          </a>
          <a
            href='#linkedin'
            className='text-white text-decoration-none mb-2 mb-sm-0'
          >
            <i className='bi bi-linkedin fs-5'></i>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
