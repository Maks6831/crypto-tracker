import React, { useEffect, useState } from 'react';
import '../styles/Timefilter.css'
import { useAuth } from '../contexts/Authcontext';

export const Timefilter =  ({changeInterval}) => {
    const [checked, setChecked] = useState('1Y');
    const { uuid, setLimits, setMainGraphData, mainGraphData, yearly,timeConverter } = useAuth();

    useEffect(()=>{
      setChecked('1Y');
      changeInterval('1y');

    },[yearly])












    const fetchAndProcessData = async (time, currency, apiKey) => {
      
      const url = `https://coinranking1.p.rapidapi.com/coin/${uuid}/history?referenceCurrencyUuid=${currency}&timePeriod=${time}`;
      const fetchOptions = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
        }
      };
      
        const response = await fetch(url, fetchOptions);
        const result = await response.json();
        const historyData = result.data.history;
        let prices = historyData.map(({price, timestamp}) => {
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
        


        return {currency, prices, graphLimit, graphBegin}
      
      
        
            

    }

    const apiCheck = async (time, currency) => {
      try {
        return await fetchAndProcessData(time, currency, process.env.REACT_APP_COINRANKING_APIKEY_ONE)
      } catch (error){
        console.log(error)
        try {
          return await  fetchAndProcessData(time, currency, process.env.REACT_APP_COINRANKING_APIKEY_TWO)
        } catch (error){
          console.log(error)
          try {
            return await fetchAndProcessData(time, currency, process.env.REACT_APP_COINRANKING_APIKEY_THREE)
          } catch (error){
            console.log("An error occurred during additional operations:", error.message);
          }
      }
        
      }

    }

  

    const mainFetch = async (time) => {
      const gbp = 'razxDUgYGNAdQ';
        const btc = 'Qwsogvtv82FCd';
        const eth = 'Hokyui45Z38f';
        const [yearDataBTC, yearDataETH, yearDataGBP] = await Promise.all([
          apiCheck(time, btc),
          apiCheck(time, gbp),
          apiCheck(time, eth),
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

    }
    const generateMain =  (e) => {
      setChecked(e.target.textContent);
      const timeInterval = timeConverter(e.target.textContent)
      mainFetch(timeInterval);
      changeInterval(timeInterval);
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
