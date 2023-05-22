import React, { useState } from 'react';
import '../styles/Timefilter.css'
import { useAuth } from '../contexts/Authcontext';

export const Timefilter =  () => {
    const [checked, setChecked] = useState('1Y');
    const { mainData, uuid, setLimits, setMainGraphData, mainGraphData } = useAuth();


    const optionFinder = (timevalue) => {
      let options;
    
      switch (timevalue) {
        case '3h':
          options = { hour: '2-digit', minute: '2-digit', hour12: false };
          break;
        case '24h':
          options = { hour: '2-digit', minute: '2-digit' };
          break;
        case '7d':
        case '30d':
        case '3m':
        case '1y':
          options = { month: 'short', day: 'numeric' };
          break;
        case '3y':
          options = { month: '2-digit', year: '2-digit' };
          break;
        case '5y':
          options = { month: '2-digit', year: '2-digit' };
          break;
        default:
          console.log(`Unknown time value: ${timevalue}`);
          break;
      }
    
      return options;
    };

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
          'X-RapidAPI-Key': process.env.COINRANKING_APIKEY,
          'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
        }
      };
      
        const response = await fetch(url, fetchOptions);
        const result = await response.json();
        const historyData = result.data.history
        const options = optionFinder(time);
        
        let prices = historyData.map(({price, timestamp}) => {
          const formattedTime = options.hour ? new Date(timestamp * 1000).toLocaleTimeString('en-GB', options) : new Date(timestamp * 1000).toLocaleDateString('en-GB', options);
          return {
            time: timestamp,
            price: parseFloat(price)
          }   
        });
        prices = prices.reverse();

        const maxPrice = Math.max(...prices.map(({ price }) => price));
        const minPrice = Math.min(...prices.map(({ price }) => price));
        let graphLimit = maxPrice
        let graphBegin = minPrice   

        switch(currency){
          default:
            graphLimit = maxPrice * 1.2;
            graphBegin = minPrice * 0.8;
          break;
          case 'razxDUgYGNAdQ':
             graphLimit = maxPrice * 1.3;
             graphBegin = minPrice * 0.9;
          break;
          case 'Qwsogvtv82FCd':
            graphLimit = maxPrice * 1.1;
            graphBegin = minPrice * 0.7
        }
        console.log(prices)


        return {currency, prices, graphLimit, graphBegin}
      
        
            

    }
    const generateMain =  (e) => {
      setChecked(e.target.textContent);
      const timeInterval = timeConverter(e.target.textContent)
      mainFetch(timeInterval);
    }

    const mainFetch = async (time) => {
      const gbp = 'Hokyui45Z38f';
        const btc = 'Qwsogvtv82FCd';
        const eth = 'razxDUgYGNAdQ';
        const [yearDataBTC, yearDataETH, yearDataGBP] = await Promise.all([
          fetchAndProcessData(time, btc),
          fetchAndProcessData(time, eth),
          fetchAndProcessData(time, gbp),
        ]);

        
        setLimits({
          BTC : [yearDataBTC.graphBegin, yearDataBTC.graphLimit],
          GBP: [yearDataGBP.graphBegin, yearDataGBP.graphLimit],
          ETH: [yearDataETH.graphBegin, yearDataETH.graphLimit]
        }
        )
        setMainGraphData(
          yearDataBTC.prices.map(({ time, price: btcPrice }) => {
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
          })
        );
        console.log(mainGraphData)
        console.log(time);

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
