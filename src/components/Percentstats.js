import React from 'react';
import '../styles/Percentstats.css';

export const Percentstats = ({time}) => {


const apiCheck = async (time, currency) => {
    try {
    //  return await findPercent(time, currency, process.env.REACT_APP_COINRANKING_APIKEY_FOUR)
    } catch (error){
      console.log(error)
      try {
        //return await  findPercent(time, currency, process.env.REACT_APP_COINRANKING_APIKEY_FIVE)
      } catch (error){
        console.log(error)
        try {
        //  return await findPercent(time, currency, process.env.REACT_APP_COINRANKING_APIKEY_SIX)
        } catch (error){
          console.log("An error occurred during additional operations:", error.message);
        }
    }
      
    }

  }





  return (
        <div className='percent-container'>
            <p>{time}</p>
            <div>number</div>
        </div>
    
  )
}
