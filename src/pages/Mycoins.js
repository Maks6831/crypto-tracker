import React, { useEffect, useState } from 'react'
import '../styles/Mycoins.css';
import { db } from '../Firebase';
import { useAuth } from '../contexts/Authcontext';
import { Coinelement } from '../components/Coinelement';

export const Mycoins = () => {
  const [myCoins, setMyCoins] = useState(['bitcoin', 'ethereum','litecoin', 'dogecoin', 'bitcoin-cash']);
  const { currentUser } = useAuth();
  const [localData, setLocalData] = useState();

  useEffect(()=>{
   // db.collection('users').doc(currentUser._delegate.uid).get().then(doc => {
   //   setMyCoins(doc.data().coins)
   
   setLocalData(JSON.parse(localStorage.getItem('saved-data')))
   // })

  },[])
 
  return (
    <div className='mycoins-container'>
      <h1>My Coins</h1>
      <div> <table>
          <thead>
            <th>#</th>
            <th>Name</th>
            <th>Change(24h)</th>
            <th>price</th>
            <th>price inBTC</th>
            <th>Market Cap</th>
            <th> Volume 24h</th>
            <th>price graph (7d)</th>
          </thead>
          <tbody>
            { localData && 
            localData.map((coin)=> (
              <Coinelement
              name={coin.name}
              iconurl={coin.iconUrl}
              symbol={coin.symbol}
              id={coin.id}
              hash={coin.hash}
              currentPrice={coin.currentPrice}
              price_btc={coin.price_btc}
              marketCap={coin.marketCap}
              volume={coin.volume}
              priceChange={coin.priceChange}
              chartData={coin.chartData}
               />
            ))

            } 
          

          </tbody>
        </table>
        {
        myCoins && myCoins.map((coin) => (<p>{coin}</p>))}</div>
    </div>
  )
}
