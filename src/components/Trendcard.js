import React from 'react'

export const Trendcard = (props) => {
  return (
    <div>
        <h3>{props.name}</h3>
        <img alt='trending-coin' src={props.image}/>
        <p>price: {props.price}</p>
        <p>rank: {props.rank}</p>

    </div>
  )
}
