import React from "react";
export default function Pagination({totalItems,itemsPerPage, onChangePage,startIndex,endIndex, currentPage}) {

    const handlePrevClick = () => {
      onChangePage(currentPage - 1);
    };
   
    const handleNextClick = () => {
      onChangePage(currentPage +1)
    };
    const handleFirstClick = () => {
    onChangePage(1);
    };
    const handleLastClick = () => {
        if(totalItems%itemsPerPage === 0){
            onChangePage(Math.floor(totalItems/itemsPerPage));
        } else {
         onChangePage(Math.floor((totalItems/itemsPerPage)+1));
        }
    };
    return (
      <>
      <nav
        className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
        aria-label="Pagination"
      >
        <div className="hidden sm:block">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{startIndex}</span> to <span className="font-medium">{endIndex}</span> of{' '}
            <span className="font-medium">{totalItems}</span> results
          </p>
        </div>
        <div className="flex flex-1 justify-between sm:justify-end">
        {currentPage !== 1 && (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <a
          /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
          onClick={handleFirstClick}
            href="#"
            className="relative inline-flex items-center rounded-md bg-blue-400 px-3 py-2 mr-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
          >
            First
          </a>
          )}
          {startIndex !== 1 && (
              /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
          <a
          onClick={handlePrevClick}
            href="#"
            className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
             </svg>
            Previous
          </a>
          )}
          { endIndex !== totalItems && (
             /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
             <>
          <a
            onClick={handleNextClick}
            href="#"
            className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
        </svg>
          </a>
          <a
          onClick={handleLastClick}
            href="#"
            className="relative inline-flex items-center rounded-md bg-blue-400 px-3 py-2 ml-1 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
          >
            Last
          </a>
          </>
          )}
          
        </div>
      </nav>
      </>
    )
  }
  