import React, { useEffect, useState } from 'react'
import '../styles/Mycoins.css';
import { db } from '../Firebase';
import { useAuth } from '../contexts/Authcontext';

export const Mycoins = () => {
  const [myCoins, setMyCoins] = useState();
  const { currentUser } = useAuth();

  useEffect(()=>{
    db.collection('users').doc(currentUser._delegate.uid).get().then(doc => {
      setMyCoins(doc.data().coins)
      
    })
  },[])

  const myCoinsCheck = () => {
    console.log(myCoins);
  }
  return (
    <div className='mycoins-container'>
      <h1>My Coins</h1>
      <div>{
        myCoins && myCoins.map((coin) => (<p>{coin}</p>))}</div>
    </div>
  )
}
