import React, { useState } from 'react'
import '../styles/Searchitem.css'
import { Coincard } from './Coincard'



export const Searchitem = (props) => {
  const [dropDown, setDropDown] = useState(false);
  const [coinInfo, setCoinInfo] = useState(null);
    
    const moreInfo = async () =>{
        await fetch("https://api.coingecko.com/api/v3/coins/" + props.id).then(res => res.json()).then(data => {
          setCoinInfo(data)

        });
        

        
    }

  return (
    <div>
    <div className='search-div' onClick={moreInfo}>
        <div>{props.name}</div>
        <img className='image' src={props.img} alt='thumb'/>
    </div>
    <div>
      {coinInfo && coinInfo.description && <Coincard
      name={coinInfo.name}
      description={coinInfo.description.en}

      />}  
    </div>
    </div>
  )
}
