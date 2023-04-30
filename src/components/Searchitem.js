import React, { useState } from 'react'
import '../styles/Searchitem.css'
import { Coincard } from './Coincard'
import { db } from '../Firebase';
import { useAuth } from '../contexts/Authcontext'
import firebase from 'firebase/compat/app';
import { m } from 'framer-motion';




export const Searchitem = (props) => {
  const [dropDown, setDropDown] = useState(false);
  const { currentUser, setUserData, setMoreInfoData, setCoinInfo, coinInfo, setDetailedInfo, setGraphLimit, graphLimit, saveCoin } = useAuth();
  
  
    
    const introInfo = async () =>{
        await fetch("https://api.coingecko.com/api/v3/coins/" + props.id).then(res => res.json()).then(data => {
          setCoinInfo(data)
        });
        
 
        
    }
  

    const moreInfo = async () => {
      await fetch('https://api.coingecko.com/api/v3/coins/' + props.id + '/market_chart?vs_currency=gbp&days=366').then(res => res.json()).then(data => {
        let maxPrice = Math.max(...data.prices.map(point => point[1]).flat());
        maxPrice = Math.ceil(maxPrice);
        setGraphLimit(maxPrice);
        

       setMoreInfoData(data.prices.map(pdata => {
        return {
          time: new Date(pdata[0]).toLocaleDateString('en-GB'),
          price: pdata[1].toFixed(2)
        }
       }))
      
       props.moreInfoRef.current.scrollIntoView({ behavior: 'smooth' });
       setDetailedInfo(coinInfo);
      

        })

      
        
      

    }
  

  return (
    <div>
    <div className='search-div' onClick={introInfo}>
        <div>{props.name}</div>
        <img className='image' src={props.img} alt='thumb'/>
    </div>
    <div>
      {coinInfo?.name === props.name && coinInfo.description && <div><Coincard
      name={coinInfo.name}
      description={coinInfo.description.en}

      />
      <button onClick={()=>{saveCoin(props.id)}}>Save</button>
      <button onClick={moreInfo}>More Info</button>

      </div>}  
    </div>
    
    </div>
  )
}
