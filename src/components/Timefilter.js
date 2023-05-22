import React, { useState } from 'react';
import '../styles/Timefilter.css'
import { useAuth } from '../contexts/Authcontext';

export const Timefilter =  () => {
    const [checked, setChecked] = useState('1Y');
    const { mainData, uuid } = useAuth();

    const optionFinder = (timevalue) => {
      const options = {
        '3h':{hour: '2-digit', minute: '2-digit', hour12: false },
        '24h':{hour: '2-digit', minute: '2-digit' },
        '7d':{ month: 'short', day: 'numeric' },
        '30d': { month: 'short', day: 'numeric' },
        '3m': { month: 'short', day: 'numeric' },
        '1y': { month: 'short', day: 'numeric' }, 
        '3y':{month: '2-digit', year: '2-digit'},
        '5y': {month: '2-digit', year: '2-digit'},
      }
  

      return options[timevalue];

    }

    const timeConverter = (time) => {
      let convertedTime;
    
      switch (time) {
        case '3H':
          convertedTime = '3h';
          break;
        case '24H':
          convertedTime = '24h';
          break;
        case '1W':
          convertedTime = '7d';
          break;
        case '1M':
          convertedTime = '30d';
          break;
        case '3M':
          convertedTime = '3m';
          break;
        case '1Y':
          convertedTime = '1y';
          break;
        case '3Y':
          convertedTime = '3y';
          break;
        case '5Y':
          convertedTime = '5y';
          break;
        default:
          console.log(`Unknown time value: ${time}`);
          break;
      }
    
      return convertedTime;
    };





    const fetchAndProcessData = async (time, currency) => {
      
      const url = `https://coinranking1.p.rapidapi.com/coin/${uuid}/history?referenceCurrencyUuid=${currency}&timePeriod=${time}`;
      const fetchOptions = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': key,
          'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
        }
      };
      
        const response = await fetch(url, fetchOptions);
        const result = await response.json();
        const historyData = result.data.history
        const options = optionFinder(time);
        
        const prices = historyData.map(({price, timestamp}) => {
          const formattedTime = !options.hour ? new Date(timestamp).toLocaleTimeString('en-GB', options) : new Date(timestamp).toLocaleDateString('en-GB', options);
          return {
            price,
            time: formattedTime
          }   
        });

        console.log(prices);

    }
    const generateMain =  (e) => {
      setChecked(e.target.textContent);
      const timeInterval = timeConverter(e.target.textContent)
      mainFetch(timeInterval);
    }

    const mainFetch = async (time) => {
      console.log(time);
      const gbp = 'Hokyui45Z38f';
        const btc = 'Qwsogvtv82FCd';
        const eth = 'razxDUgYGNAdQ';
        const [yearDataBTC, yearDataETH, yearDataGBP] = await Promise.all([
          //fetchAndProcessData(time, btc),
          //fetchAndProcessData(checked, eth),
          //fetchAndProcessData(checked, gbp),
        ]);

    }



  return (
    <div>
      <span onClick={generateMain} className={checked === '3H' ? 'interval-item active': 'interval-item'}>3H</span>
        <span onClick={generateMain} className={checked === '24H' ? 'interval-item active': 'interval-item'}>24H</span>
        <span onClick={generateMain} className={checked === '1W' ? 'interval-item active': 'interval-item'}>1W</span>
        <span onClick={generateMain} className={checked === '1M' ? 'interval-item active': 'interval-item'}>1M</span>
        <span onClick={generateMain} className={checked === '3M' ? 'interval-item active': 'interval-item'}>3M</span>
        <span onClick={generateMain} className={checked === '1Y' ? 'interval-item active': 'interval-item'}>1Y</span>
        <span onClick={generateMain} className={checked === '3Y' ? 'interval-item active': 'interval-item'}>3Y</span>
        <span onClick={generateMain} className={checked === '5Y' ? 'interval-item active': 'interval-item'}>5Y</span>
    </div>
  )
}
