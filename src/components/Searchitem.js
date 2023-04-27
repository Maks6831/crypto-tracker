import React, { useState } from 'react'
import '../styles/Searchitem.css'
import { Coincard } from './Coincard'
import { db } from '../Firebase';
import { useAuth } from '../contexts/Authcontext'
import firebase from 'firebase/compat/app';




export const Searchitem = (props) => {
  const [dropDown, setDropDown] = useState(false);
  const { currentUser} = useAuth();
  const [coinInfo, setCoinInfo] = useState(null);
    
    const moreInfo = async () =>{
        await fetch("https://api.coingecko.com/api/v3/coins/" + props.id).then(res => res.json()).then(data => {
          setCoinInfo(data)
        });
        
 
        
    }
    const saveCoin = () => {
      db.collection('users').doc(currentUser._delegate.uid).update({
        coins: firebase.firestore.FieldValue.arrayUnion(props.id)
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
    <div onClick={saveCoin}>Save</div>
    </div>
  )
}
