import React, { useState } from 'react';
import '../styles/Dropdown.css';


export const Dropdown = ({openDropdown, handlePngDownload}) => {


    const handleOptionSelect = (param, event) => { 
      console.log('success 1!')
      event.preventDefault();
        //openDropdown();
        console.log('success')
            handlePngDownload(param)

    }

  return (
    <div className="dropdown-container">
        <div className='dropdown-menu'>

        
      <div className="dropdown-option dropdown-1" onClick={(event) => handleOptionSelect('PNG', event)}>
        Download PNG
      </div>
      <div className="dropdown-option" onClick={(event) => handleOptionSelect('JPEG', event)}>
        Download JPEG
      </div>
      </div>
    </div>
  )
}
