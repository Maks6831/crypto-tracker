import { hover } from '@testing-library/user-event/dist/hover';
import React, { useEffect, useState } from 'react'
import { AreaChart, Area,  ResponsiveContainer, YAxis, LineChart } from 'recharts';
import { useAuth } from '../contexts/Authcontext';
import { m } from 'framer-motion';

export const Coinelement = ({ name, iconurl, symbol, id, hash, currentPrice, price_btc, marketCap, volume, priceChange, chartData }) => {
    const [graphData, setGraphData] = useState();
    const { setYearly, setMainData, localData, mainData, yearly, setLimits, limits } = useAuth();
    const [upper, setUpper] = useState();
    const [lower, setLower] = useState();
    const [lineColor, setLineColor] = useState();
    const [background, setBackground] = useState(false);

    const getObjectById = (array, id) => {
      return array.find(obj => obj.id === id);
    };

    const fetchAndProcessData = async (coinId, currency) => {
      const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency}&days=366`;
      const response = await fetch(url);
      const data = await response.json();
    
      const options = { month: 'short', day: 'numeric' };
      const prices = data.prices.map(([time, price]) => ({
        time: new Date(time).toLocaleDateString('en-GB', options),
        price,
      }));
      
      const maxPrice = Math.max(...prices.map(({ price }) => price));
      const minPrice = Math.min(...prices.map(({ price }) => price));
      let graphLimit = maxPrice
          let graphBegin = minPrice   
      
      switch(currency){
        default:
          graphLimit = maxPrice * 1.2;
          graphBegin = minPrice * 0.8;
        break;
        case 'eth':
           graphLimit = maxPrice * 1.3;
           graphBegin = minPrice * 0.9;
        break;
        case 'btc':
          graphLimit = maxPrice * 1.1;
          graphBegin = minPrice * 0.7
          





      }

      return { coinId, currency, prices, graphLimit, graphBegin };
    };
    

    const generateMain = async (coinId) => {
      const [yearDataBTC, yearDataETH, yearDataGBP] = await Promise.all([
        fetchAndProcessData(coinId, 'btc'),
        fetchAndProcessData(coinId, 'eth'),
        fetchAndProcessData(coinId, 'gbp'),
      ]);
      setLimits({
        BTC : [yearDataBTC.graphBegin, yearDataBTC.graphLimit],
        GBP: [yearDataGBP.graphBegin, yearDataGBP.graphLimit],
        ETH: [yearDataETH.graphBegin, yearDataETH.graphLimit]
      }
      )

      setYearly(yearDataBTC.prices.map(({ time, price: btcPrice }) => {
        const ethPriceObj = yearDataETH.prices.find((p) => p.time === time);
        const gbpPriceObj = yearDataGBP.prices.find((p) => p.time === time);
        return {
          time,
          BTC: btcPrice,
          ETH: ethPriceObj.price,
          GBP: gbpPriceObj.price,
        };
      }));
    console.log(limits)
      // ...
    };
    
    
    useEffect(()=>{
        setGraphData(
            chartData.map(data => {
                return {
                    time : data[0],
                    price: data[1],

                }
        
            })
        )
        let maxPrice = Math.max(...chartData.map(point => point[1]).flat());
        setUpper(maxPrice * 1.2);
        let minPrice = Math.min(...chartData.map(point => point[1]).flat());
        setLower(minPrice * 0.8);
        priceChange.includes('-') ? setLineColor('#ff4d4d') : setLineColor('#6ccf59');
        priceChange.includes('-') ? setBackground(false) : setBackground(true);
          },[])
    return (
      <tr className='table-row' onClick={()=>{generateMain(id) }}>
        <td className='td-hash'>{hash}</td>
        <td className='td-name'>{<img className='table-icon' src={iconurl} alt='icon'/>}{name}<div className='symbol'>&nbsp; • {symbol}</div></td>
        <td className='td-change' style={{color: lineColor}}>
            <div className={!background ? 'background-down':'background-up'}>
              {priceChange}
            </div>
          </td>
        <td className='td-price'>{currentPrice}</td>
        <td className='td-btc'>{price_btc}</td>
        <td className='td-cap'>{marketCap}</td>
        <td className='td-volume'>{volume}</td>
        <td className='td-graph'>
            <div className='little-line'>
            <ResponsiveContainer width="100%" height="100%" className='response'>
        <AreaChart
            width={150}
            height={50}
            data={graphData}
            margin={{
                top: -30,
                right: 0,
                left: 0,
                bottom: -30,
              }}
              yAxis={{
                domain: [0, 100],
                axisLine: false, // hide the axis line
                tickLine: false, // hide the tick lines
              }}
        >
            <YAxis display="none" domain={[lower, upper]}/>
          <Area type="monotone" dataKey="price" stroke={lineColor} fill="none"/>
        </AreaChart>
        </ResponsiveContainer>
            </div>
        </td>
      </tr>
    )
            }