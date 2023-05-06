import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import '../styles/Mycoins.css';
import { db } from '../Firebase';
import { useAuth } from '../contexts/Authcontext';
import { Coinelement } from '../components/Coinelement';
import { ResponsiveContainer, Area, AreaChart, YAxis, XAxis, Tooltip } from 'recharts';
import { SwitchLayoutGroupContext } from 'framer-motion';

export const Mycoins = () => {
  //const [myCoins, setMyCoins] = useState(['bitcoin', 'ethereum','litecoin', 'dogecoin', 'bitcoin-cash']);
  const [ isCheckedBTC, setIsCheckedBTC ] = useState(false);
  const [ isCheckedETH, setIsCheckedETH ] = useState(false);
  const [containerWidth, setContainerWidth] = useState(false);
  const [btcAnima, setBtcAnima ] = useState(true);
  const [gbpAnima, setGbpAnima ] = useState(true);
  const [ethAnima, setEthAnima ] = useState(true);
  const { currentUser, setLocalData, localData, mainData, yearly, limits } = useAuth();
  const Yformatter = (value) =>{
    if(value<= 0.0001){
      return value.toFixed(10)
    } else if(value <= 0.1){
      return value.toFixed(3)
    } else if(value <=1) {
      return value.toFixed(2)
     } else if(value <= 10){
      return value.toFixed(1)
      } else {
        return value.toFixed(0)
      }
    }

    const onAnimationStart = useCallback((param) => {
      setTimeout(() => {
          param(false)
      }, 1500)
  }, [])


    const handleClick = async (value)=> {
      if(value === 'btc'){
        setIsCheckedBTC(!isCheckedBTC);
      } else if(value === 'eth'){
        setIsCheckedETH(!isCheckedETH)

      }
      
      setContainerWidth(!containerWidth);
      
    }

  

  useEffect(()=>{
   // db.collection('users').doc(currentUser._delegate.uid).get().then(doc => {
   //   setMyCoins(doc.data().coins)
   
   setLocalData(JSON.parse(localStorage.getItem('saved-data')))
   // })

  },[])

  useLayoutEffect(()=>{
    setBtcAnima(true);
    setGbpAnima(true);
    setEthAnima(true);
    setIsCheckedBTC(false);
    setIsCheckedETH(false);

  },[yearly])
 
  return (
    <div className='mycoins-parent'>
      <div className='mycoins-container'>
      <h1>My Coins</h1>
      { yearly && <div className='main-section'>
        <div className='main-coin-title'>
          <div>Rank</div>
          <div>name</div>
          <div className='main-price'>
          <div>priceGBP</div>
          <div>price change</div>
          </div>
        </div>
        <div className='main-graph-section'>
          <h3>NAME Price Chart</h3>
          <div className='graph-container'>
          <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={800}
          height={400}
          data={yearly}
          margin={{
            top: 20,
            right: 50,
            left: 50,
            bottom: 20,
          }}
        >
        <defs>
            <linearGradient id="red-color" x1="0" y1="0" x2="0" y2="1">
              <stop offset="20%" stopColor="#FF0000" stopOpacity={0.2}/>
              <stop offset="80%" stopColor="#FF0000" stopOpacity={0.05}/>
            </linearGradient>
            
        </defs>
          <XAxis  dataKey="time" axisLine={false} tickLine={false} label={{ value: 'Date', position: 'insideBottom', offset: -10 }}  />
          <YAxis domain={[limits.GBP[0], limits.GBP[1]]} User tickFormatter={(value) => Yformatter(value)} axisLine={false} tickLine={false} label={{ value: 'Price(GBP)', angle: -90, position: 'insideLeft', offset: -5, dy: 20}}
          />
          {isCheckedBTC && 
          <YAxis yAxisId="right1"  width={80} orientation="right" User tickFormatter={(value) => Yformatter(value)} axisLine={false} tickLine={false}
          domain={[limits.BTC.graphBegin, limits.BTC.graphLimit]}/>
          }
          {isCheckedETH && 
          <YAxis yAxisId="right2"  width={80} orientation="right" User tickFormatter={(value) => Yformatter(value)} axisLine={false} tickLine={false} 
          domain={[limits.ETH.graphBegin, limits.ETH.graphLimit]}/>
          }

        <Tooltip />
          <Area type="monotone" data={yearly.GBP} dataKey="GBP" isAnimationActive={gbpAnima} onAnimationStart={()=>{onAnimationStart(setGbpAnima)}} stroke="#FF0000" fillOpacity={1} fill="url(#red-color)" strokeWidth={2} />
          {isCheckedBTC && 
          <Area type="monotone" data={yearly.BTC} dataKey="BTC" stroke="#39FF14" fill='none'isAnimationActive={btcAnima} strokeWidth={2} onAnimationStart={()=>{onAnimationStart(setBtcAnima)}}  yAxisId="right1" />
          }
          {isCheckedETH && 
          <Area type="monotone" data={yearly.ETH} isAnimationActive={ethAnima}  onAnimationStart={()=>{onAnimationStart(setEthAnima)}} dataKey="ETH" stroke="#1F51FF" fillOpacity={0}  strokeWidth={2} yAxisId="right2" />
          }
        </AreaChart>
        </ResponsiveContainer>
          </div>
          <label>
      <input type="checkbox" checked={isCheckedBTC} onChange={()=>{handleClick('btc')}} />
      BTC
    </label>
    <label>
      <input type="checkbox" checked={isCheckedETH} onChange={()=>{handleClick('eth')}} />
      ETH
    </label>


        </div>
      </div>}
      <div className='table-container'> 
        <table className='table'>
          <thead className='thead'>
            <th className='hash'>#</th>
            <th className='tname'>Name</th>
            <th className='tchange'>Change(24h)</th>
            <th className='tprice'>price</th>
            <th className='tbtc'>price in BTC</th>
            <th className='tcap'>Market Cap</th>
            <th className='tvolume'> Volume 24h</th>
            <th className='tgraph'>price graph (7d)</th>
          </thead>
          <tbody className='tbody'>
            { localData && 
            localData.map((coin)=> (
              <Coinelement
              key={coin.id}
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
        </div>
    </div>
    </div>
  )
}
