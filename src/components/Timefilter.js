import React, { useState } from 'react';
import '../styles/Timefilter.css'

export const Timefilter = () => {
    const [checked, setChecked] = useState('1Y')

    const generateMain = (e) => {
        setChecked(e.target.textContent);
    }



  return (
    <div>
        <span onClick={generateMain} className={checked === '24H' ? 'interval-item active': 'interval-item'}>24H</span>
        <span onClick={generateMain} className={checked === '1W' ? 'interval-item active': 'interval-item'}>1W</span>
        <span onClick={generateMain} className={checked === '1M' ? 'interval-item active': 'interval-item'}>1M</span>
        <span onClick={generateMain} className={checked === '3M' ? 'interval-item active': 'interval-item'}>3M</span>
        <span onClick={generateMain} className={checked === '6M' ? 'interval-item active': 'interval-item'}>6M</span>
        <span onClick={generateMain} className={checked === '1Y' ? 'interval-item active': 'interval-item'}>1Y</span>
    </div>
  )
}
