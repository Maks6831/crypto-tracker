import React, { useEffect, useLayoutEffect, useState } from 'react';
import '../styles/Percentstats.css';
import { useAuth } from '../contexts/Authcontext';

export const Percentstats = ({time}) => {

    const { timeConverter, uuid } = useAuth();
    const [percentValue, setPercentValue] = useState('nothing');

    const findPercent = async (newTime, apiKey) => {
        const url = `https://coinranking1.p.rapidapi.com/coin/${uuid}/history?referenceCurrencyUuid=razxDUgYGNAdQ&timePeriod=${newTime}`;
        const fetchOptions = {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
          }
        };
        const response = await fetch(url, fetchOptions);
        const result = await response.json();
          let percentage = result.data.change + '%'
       if(!percentage.includes('-')){
        percentage = '+' + percentage;
        return percentage;
       }

       return percentage;

       } 



const apiCheck = async (timevalue) => {
    try {
     return await findPercent(timevalue, process.env.REACT_APP_COINRANKING_APIKEY_FOUR)
    } catch (error){
      console.log(error)
      try {
        return await  findPercent(timevalue, process.env.REACT_APP_COINRANKING_APIKEY_FIVE)
      } catch (error){
        console.log(error)
        try {
          return await findPercent(timevalue, process.env.REACT_APP_COINRANKING_APIKEY_SIX)
        } catch (error){
          console.log("An error occurred during additional operations 1 1 1 :", error.message);
        }
    }
      
    }

  }

 
  const mainFetch = async (times) => {
    const timeValue = timeConverter(times);
    const data = await apiCheck(timeValue)
    console.log(data) 

    setPercentValue(data);

  }

  useLayoutEffect(()=>{
    mainFetch(time)

  }, [uuid])





  return (
        <div className='percent-container'>
            <p>{time}</p>
            <div className={percentValue?.includes('-')? 'percent-down' : 'percent-up'}>{percentValue}</div>
        </div>
    
  )
}
