import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    onPageChange(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`btn ${
            i === currentPage ? "btn-primary" : "btn-outline-primary"
          } mx-1`}
          onClick={() => handlePageClick(i)}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className='d-flex justify-content-center align-items-center mt-4'>
      <button
        className='btn btn-outline-primary mx-1'
        onClick={handlePrevPage}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {renderPageNumbers()}

      <button
        className='btn btn-outline-primary mx-1'
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
