import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import '../styles/Mycoins.css';
import { db } from '../Firebase';
import { useAuth } from '../contexts/Authcontext';
import { FaEllipsisH } from 'react-icons/fa';
import { Coinelement } from '../components/Coinelement';
import { ResponsiveContainer, Area, AreaChart, YAxis, XAxis, Tooltip} from 'recharts';
import { SwitchLayoutGroupContext } from 'framer-motion';
import { Dropdown } from '../components/Dropdown';


export const Mycoins = () => {
  //const [myCoins, setMyCoins] = useState(['bitcoin', 'ethereum','litecoin', 'dogecoin', 'bitcoin-cash']);
  const [ isCheckedBTC, setIsCheckedBTC ] = useState(false);
  const [ isCheckedETH, setIsCheckedETH ] = useState(false);
  const [containerWidth, setContainerWidth] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [lineColor, setLineColor] = useState();
  const [background, setBackground] = useState();
  const [btcAnima, setBtcAnima ] = useState(true);
  const [gbpAnima, setGbpAnima ] = useState(true);
  const [ethAnima, setEthAnima ] = useState(true);
  const [colorEth, setColorEth] = useState();
  const [btcChange, setBtcChange] = useState();
  const { currentUser, setLocalData, localData, mainData, yearly, limits } = useAuth();

  const openDropdown = () => {
    setDropDown(!dropDown);
    console.log(dropDown);
    
  }

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
      if (active && payload && payload.length) {
        payload[2] ? setColorEth(payload[2]?.stroke) : setColorEth(payload[1]?.stroke)
        return (
          <div className="custom-tooltip">
            <p className="label">{`Date: ${label}`}</p>
            <p className='tooltip-gbp' style={{color: payload[0]?.stroke}}>{`GBP: ${Yformatter(payload[0].payload.GBP, 'gbp')}`}</p>
            {isCheckedBTC &&
            <p className='tooltip-btc' style={{color: payload[1].stroke}}>{`BTC: ฿${payload[0].payload.BTC.toFixed(8)}`}</p>}
            {isCheckedETH &&
            <p className='tooltip-eth' style={{color: colorEth}}>{`ETH: \u2261 ${payload[0].payload.ETH.toFixed(8)}`}</p>}
          </div>
        );
      }

    }

    const percentCalc = (current, previous) =>{
      return (
        (((current- previous) / current) * 100).toFixed(2) + '%'
      )

    }

  useEffect(()=>{
   // db.collection('users').doc(currentUser._delegate.uid).get().then(doc => {
   //   setMyCoins(doc.data().coins)
   
   setLocalData(JSON.parse(localStorage.getItem('saved-data')))
   yearly && setBtcChange(percentCalc(yearly[yearly.length-1].BTC, yearly[yearly.length-2].BTC))
          
   
   // })

  },[yearly])

  useLayoutEffect(()=>{
    setBtcAnima(true);
    setGbpAnima(true);
    setEthAnima(true);
    setIsCheckedBTC(false);
    setIsCheckedETH(false);
    mainData?.priceChange.includes('-') ? setLineColor('#ff4d4d') : setLineColor('#6ccf59');
    mainData?.priceChange.includes('-') ? setBackground(false) : setBackground(true);
    
    

  },[yearly])

  
 
  return (
    <div className='mycoins-parent'>
      <div className='mycoins-container'>
      <h1>My Coins</h1>
      { mainData && yearly && <div className='main-section'>
        <div className='main-coin-title'>
          <img className='title-icon' src={mainData.iconurl} alt='crypto icon'/>
          <h1>{mainData.name} Price</h1>
          <div className='symbol symbol-bigger'>&nbsp;• {mainData.symbol}</div>
          </div>
          <div className='main-coin-title'>
          <h1>{mainData.currentPrice}</h1>
          <div  style={{color: lineColor, fontSize: '1.2rem', marginLeft: '5px'}} className={!background ? 'background-down':'background-up'}>
              {mainData.priceChange}
            </div>
            </div>
            <div className='main-coin-title'>
              <h1>฿ {(yearly[yearly.length-1].ETH).toFixed(8)}</h1>
              <div  style={{color: btcChange?.includes('-') ? '#ff4d4d': '#6ccf59', fontSize: '1.2rem', marginLeft: '5px'}} className={btcChange?.includes('-') ? 'background-down':'background-up'}>
              {btcChange?.includes('-')? btcChange : '+' + btcChange}
            </div>
  </div>
          
        
        <div className='main-graph-section'>
          <div className='chart-title'>
          <div>{mainData.name} Price Chart ({mainData.symbol})</div>
          <div className='download-section' >
            <div className=''></div>
          <p className='elipsis' onClick={openDropdown}>{<FaEllipsisH/>}</p>
          { dropDown && 
          <Dropdown
          openDropdown={openDropdown}
           />
           
          } 
          </div>
          
          
          </div>
          
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
         />
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

          <Tooltip content={<CustomTooltip />}/>
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
