import React, { useContext, useEffect, useState } from 'react'
import { auth } from '../Firebase';
import { db } from '../Firebase';


const Authcontext = React.createContext();

export const useAuth = () => {
    return useContext(Authcontext)
}


export const Authprovider  = ({children}) => {
    const [currentUser, setCurrentUser] = useState();
    const [userData, setUserData] = useState();
    const [moreInfoData, setMoreInfoData] = useState();
    const [coinInfo, setCoinInfo] = useState(null);
    const [detailedInfo, setDetailedInfo] = useState();
    const [graphLimit, setGraphLimit] = useState(null);

    const signup = (email, password, firstname, lastname) =>{
        auth.createUserWithEmailAndPassword(email, password).then(cred => {
          return db.collection('users').doc(cred.user.uid).set({
            firstname: firstname,
            lastname: lastname,
            created: new Date(),
            coins: []
          })
        }).then(()=>{})
    }

    const login = (email, password) => {
      auth.signInWithEmailAndPassword(email, password)
    }

    const logout = ()=>{
      return auth.signOut();
    }

    const moneyFormatter = (num) => {
      if(1000000 <= num && num < 1000000000){
        return '£' + (num / 1000000).toFixed(1) + 'M';
      } else if(num >= 1000000000 ){
        return '£' + (num / 1000000000).toFixed(1) + 'B';

      }
    }

    const saveCoin = async (coinInfo) => {
      //   db.collection('users').doc(currentUser._delegate.uid).update({
      //     coins: firebase.firestore.FieldValue.arrayUnion(id)
      //   });
      const chartFetch = await fetch('https://api.coingecko.com/api/v3/coins/' + coinInfo.id+ '/market_chart?vs_currency=gbp&days=7')
      const chartData = await chartFetch.json();
      const today = chartData.prices[chartData.prices.length-1][0]
      const priceToday = chartData.prices[chartData.prices.length-1][1];
      console.log(today);
      const yesterApprox = today - (24 * 60 * 60 * 1000);
      console.log('approx = ' + yesterApprox);
      let closestTimestamp = chartData.prices[0][0];
      let closestPrice = chartData.prices[0][1];
      for (let i = 1; i < chartData.prices.length; i++) {
        const timestamp = chartData.prices[i][0];
        const price = chartData.prices[i][1];
        if (Math.abs(timestamp - yesterApprox) < Math.abs(closestTimestamp - yesterApprox)) {
          closestTimestamp = timestamp;
          closestPrice = price;
        }
      }
      // priceChange is the 24% change 
      let priceChange = (((priceToday - closestPrice) / priceToday) * 100).toFixed(2) + '%';
      if(!priceChange.includes('-')){
        priceChange = '+' + priceChange;
      }

      const marketFetch = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=gbp&ids=bitcoin&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en')
        const marketData = await marketFetch.json();
        const marketV = marketData[0].market_cap;
        const marketCap = moneyFormatter(marketV);
        console.log(marketCap);
        console.log(marketData);
        console.log(coinInfo);
        // this will be the 24h volume
        const volume = moneyFormatter(coinInfo.market_data.total_volume.gbp)
        //this is the current price. 
        const currentPrice = '£' + priceToday.toFixed(2);
        // price in btc
        const price_btc = (coinInfo.market_data.current_price.btc).toFixed(8);
        console.log(price_btc);
        // this is the symbol
        const symbol = (coinInfo.symbol).toUpperCase();
        // this is the hash 
        const hash = coinInfo.coingecko_rank;
        const iconUrl = coinInfo.image.small;
        const storedData = {
          name: coinInfo.name,
          iconUrl: iconUrl,
          symbol: symbol,
          id: coinInfo.id,
          hash: hash,
          currentPrice: currentPrice,
          price_btc: price_btc,
          marketCap: marketCap,
          volume: volume,
          priceChange: priceChange,
          chartData: chartData.prices
        }

        let localData = JSON.parse(localStorage.getItem('saved-data'))||[];
        const check = localData.some(obj => obj.id === storedData.id)
        if(!check){
          localData.push(storedData);
        }
        localStorage.setItem('saved-data', JSON.stringify(localData));
      
       }


    

    useEffect(()=>{

        const unsubscribe = auth.onAuthStateChanged(user =>{
            setCurrentUser(user)

            return unsubscribe
        })
    },[])
    const value = {
        currentUser,
        signup,
        login,
        logout,
        userData,
        setUserData,
        moreInfoData,
        setMoreInfoData,
        coinInfo,
        setCoinInfo,
        detailedInfo,
        setDetailedInfo,
        graphLimit,
        setGraphLimit,
        saveCoin
    }

  return (
    <Authcontext.Provider value={value}>
      {children}  
    </Authcontext.Provider>
  )
}
