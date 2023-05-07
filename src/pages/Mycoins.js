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

  const Yformatter = (value, currency) =>{
    let formattedValue = '';
    if(value<= 0.001){
      formattedValue =  value.toExponential(1);
    } else if(value <= 0.1){
       formattedValue = value.toFixed(3)
    } else if(value <=1) {
      formattedValue =  value.toFixed(2)
     } else if(value <= 10){
      formattedValue = value.toFixed(1)
      } else {
        formattedValue = value.toFixed(0)
      }

      switch(currency){
          case 'btc':
            formattedValue = '฿' + formattedValue;
          break;
          case 'eth':
            formattedValue = '\u2261' + formattedValue;
          break;
          default:
          formattedValue = '£' + formattedValue;
          break;
      }
      return formattedValue;
    }

    const onAnimationStart = useCallback((param) => {
      setTimeout(() => {
          param(false)
      }, 500)
  }, [])


    const handleClick = async (value)=> {
      if(value === 'btc'){
        setIsCheckedBTC(!isCheckedBTC);
      } else if(value === 'eth'){
        setIsCheckedETH(!isCheckedETH)

      }
      
      setContainerWidth(!containerWidth);
      
    }
  
    const CustomTooltip = ({ active, payload, label }) => {
      console.log('this is payload ' + JSON.stringify(payload));
      if (active && payload && payload.length) {
        return (
          <div className="custom-tooltip">
            <p className="label">{`Date: ${label}`}</p>
            <p className='tooltip-gbp' style={{color: payload[0].stroke}}>{`GBP: £${Yformatter(payload[0].payload.GBP)}`}</p>
            {isCheckedBTC &&
            <p className='tooltip-btc' style={{color: payload[1].stroke}}>{`BTC: ฿${payload[0].payload.BTC.toFixed(9)}`}</p>}
            {isCheckedETH &&
            <p className='tooltip-eth' style={{color: payload[2].stroke}}>{`ETH: \u2261 ${payload[0].payload.ETH.toFixed(9)}`}</p>}
          </div>
        );
      }

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
            <linearGradient id="red-color" x1="" y1="0" x2="0" y2="1">
              <stop offset="20%" stopColor="#FF0000" stopOpacity={0.1}/>
              <stop offset="80%" stopColor="#FF0000" stopOpacity={0.1}/>
            </linearGradient>
            
        </defs>
          <XAxis  
          dataKey="time" 
          axisLine={false} 
          tickLine={false} 
          label={{ value: 'Date', position: 'insideBottom', offset: -10 }}  />
          <YAxis 
          domain={[limits.GBP[0], limits.GBP[1]]} 
          User 
          tickFormatter={(value) => Yformatter(value, 'gbp')} 
          axisLine={false} 
          tickLine={false} 
          />
          {isCheckedBTC && 
          <YAxis yAxisId="right1"  
          width={80} orientation="right" 
          User 
          tickFormatter={(value) => Yformatter(value, 'btc')} 
          tick={{ fill: '#39FF14' }}
          axisLine={false} 
          tickLine={false}
          domain={[limits.BTC.graphBegin, limits.BTC.graphLimit]}/>
          }
          {isCheckedETH && 
          <YAxis 
          yAxisId="right2"  
          width={80} 
          orientation="right" 
          User 
          tickFormatter={(value) => Yformatter(value, 'eth')} 
          tick={{ fill: '#1F51FF' }}
          axisLine={false} tickLine={false} 
          domain={[limits.ETH.graphBegin, limits.ETH.graphLimit]}/>
          }

          <Tooltip content={<CustomTooltip />} />
          <Area 
          type="monotone" 
          data={yearly.GBP} 
          dataKey="GBP" 
          isAnimationActive={gbpAnima} 
          onAnimationStart={()=>{onAnimationStart(setGbpAnima)}} 
          animationDuration={500}
          stroke="#FF0000" 
          fillOpacity={1} 
          fill="url(#red-color)" 
          strokeWidth={2} 
          />
          {isCheckedBTC && 
          <Area 
          type="monotone" 
          data={yearly.BTC} 
          dataKey="BTC" 
          stroke="#39FF14" 
          fill='none'
          isAnimationActive={btcAnima} 
          animationDuration={500}
          strokeWidth={2} 
          onAnimationStart={()=>{onAnimationStart(setBtcAnima)}}  
          yAxisId="right1" 
          />
          }
          {isCheckedETH && 
          <Area 
          type="monotone" 
          data={yearly.ETH} 
          isAnimationActive={ethAnima}
          animationDuration={500}  
          onAnimationStart={()=>{onAnimationStart(setEthAnima)}} 
          dataKey="ETH" 
          stroke="#1F51FF" 
          fillOpacity={0}  
          strokeWidth={2} 
          yAxisId="right2" 
          />
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
