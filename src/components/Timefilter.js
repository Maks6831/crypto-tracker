import React, { useState } from 'react';
import '../styles/Timefilter.css'
import { useAuth } from '../contexts/Authcontext';

export const Timefilter =  () => {
    const [checked, setChecked] = useState('1Y');
    const { mainData, uuid } = useAuth();

    const optionFinder = (timevalue) => {
      options = {
        '24h': 
      }
    }





    const fetchAndProcessData = async (time, currency) => {
      console.log(time)
      
      const url = `https://coinranking1.p.rapidapi.com/coin/${uuid}/history?referenceCurrencyUuid=${currency}&timePeriod=${time}`;
      const fetchOptions = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': process.env.COINRANKING_APIKEY,
          'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
        }
      };
      
        const response = await fetch(url, fetchOptions);
        const result = await response.json();
        const historyData = result.data.history
        const options = { month: 'short', day: 'numeric' };
        const prices = historyData.map(({price, timestamp}) => ({
          price,
          time: new Date(timestamp).toLocaleDateString('en-GB', options),
        }));

        console.log(prices);
      

    }



    const generateMain = async (e) => {
        setChecked(e.target.textContent);
        const gbp = 'Hokyui45Z38f';
        const btc = 'Qwsogvtv82FCd';
        const eth = 'razxDUgYGNAdQ';
        const [yearDataBTC, yearDataETH, yearDataGBP] = await Promise.all([
          fetchAndProcessData(checked, btc),
          //fetchAndProcessData(checked, eth),
          //fetchAndProcessData(checked, gbp),
        ]);


      

        

    }



  return (
    <div>
        <span onClick={generateMain} className={checked === '24H' ? 'interval-item active': 'interval-item'}>24h</span>
        <span onClick={generateMain} className={checked === '7d' ? 'interval-item active': 'interval-item'}>7d</span>
        <span onClick={generateMain} className={checked === '1M' ? 'interval-item active': 'interval-item'}>1M</span>
        <span onClick={generateMain} className={checked === '3M' ? 'interval-item active': 'interval-item'}>3M</span>
        <span onClick={generateMain} className={checked === '6M' ? 'interval-item active': 'interval-item'}>6M</span>
        <span onClick={generateMain} className={checked === '1Y' ? 'interval-item active': 'interval-item'}>1Y</span>
    </div>
  )
}
