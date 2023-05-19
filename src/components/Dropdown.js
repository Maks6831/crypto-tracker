import React, { useState } from 'react';
import '../styles/Dropdown.css';


export const Dropdown = ({openDropdown, handlePngDownload}) => {


    const handleOptionSelect = (param) => { 
        openDropdown();
            handlePngDownload(param)

    }

  return (
    <div className="dropdown-container">
        <div className='dropdown-menu'>

        
      <div className="dropdown-option dropdown-1" onClick={() => handleOptionSelect('PNG')}>
        Download PNG
      </div>
      <div className="dropdown-option" onClick={() => handleOptionSelect('JPEG')}>
        Download JPEG
      </div>
      </div>
    </div>
  )
}
