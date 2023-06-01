import { hover } from '@testing-library/user-event/dist/hover';
import React, { useEffect, useState } from 'react'
import { AreaChart, Area,  ResponsiveContainer, YAxis, LineChart } from 'recharts';
import { useAuth } from '../contexts/Authcontext';
import { m } from 'framer-motion';

export const Coinelement = ({ name, iconurl, symbol, id, hash, currentPrice, price_btc, marketCap, volume, priceChange, chartData }) => {
    const [graphData, setGraphData] = useState();
    const { setYearly, setMainData, localData, mainData, yearly, setLimits, limits, setUuid, uuid, setMainGraphData } = useAuth();
    const [upper, setUpper] = useState();
    const [lower, setLower] = useState();
    const [lineColor, setLineColor] = useState();
    const [background, setBackground] = useState(false);

    const getObjectById = (array, id) => {
      return array.find(obj => obj.id === id);
    };
    function checkTimeKeys(array1, array2) {
      const timeKeys1 = new Set(array1.map(obj => obj.time));
      const timeKeys2 = new Set(array2.map(obj => obj.time));
      return JSON.stringify(Array.from(timeKeys1)) === JSON.stringify(Array.from(timeKeys2));
    }

    const fetchAndProcessData = async (coinId, currency) => {
      const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency}&days=366`;
      const response = await fetch(url);
      const data = await response.json();
      const prices = data.prices.map(([time, price]) => ({
        time: time /1000,
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
      console.log(checkTimeKeys(yearDataBTC.prices, yearDataGBP.prices))
      setLimits({
        BTC : [yearDataBTC.graphBegin, yearDataBTC.graphLimit],
        GBP: [yearDataGBP.graphBegin, yearDataGBP.graphLimit],
        ETH: [yearDataETH.graphBegin, yearDataETH.graphLimit]
      }
      )

      setYearly(yearDataBTC.prices.map(({ time, price: btcPrice }) => {
        const ethPriceObj = yearDataETH.prices.find((p) => p.time === time);
        const ethPrice = ethPriceObj ? ethPriceObj.price : null; // Add null check to handle missing time entries
        const gbpPriceObj = yearDataGBP.prices.find((p) => p.time === time);
        const gbpPrice = gbpPriceObj ? gbpPriceObj.price : null; // Add null check to handle missing time entries
        return {
          time,
          BTC: btcPrice,
          ETH: ethPrice,
          GBP: gbpPrice,
        };
      }));
      setMainGraphData(yearDataBTC.prices.map(({ time, price: btcPrice }) => {
        const ethPriceObj = yearDataETH.prices.find((p) => p.time === time);
        const ethPrice = ethPriceObj ? ethPriceObj.price : null; // Add null check to handle missing time entries
        const gbpPriceObj = yearDataGBP.prices.find((p) => p.time === time);
        const gbpPrice = gbpPriceObj ? gbpPriceObj.price : null; // Add null check to handle missing time entries
        return {
          time,
          BTC: btcPrice,
          ETH: ethPrice,
          GBP: gbpPrice,
        };
      }));

    setMainData(
      { name, iconurl, symbol, id, hash, currentPrice, price_btc, marketCap, volume, priceChange, chartData }
    )
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-key': process.env.COINRANKING_APIKEY,
        'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
      }
    }
    const url = `https://api.coinranking.com/v2/search-suggestions?query=${symbol}`
    const rankFetch = await fetch(url, options);
    const rankResult = await rankFetch.json();
    setUuid(rankResult.data.coins[0].uuid);
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