import React from 'react'
import '../styles/Searchitem.css'

export const Searchitem = (props) => {
  return (
    <div className='search-div'>
        <div>{props.name}</div>
        <img className='image' src={props.img} alt='thumb'/>
    </div>
  )
}
