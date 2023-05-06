import React, { useEffect, useState, useRef } from 'react'
import { useAuth } from '../contexts/Authcontext'
import { useNavigate } from 'react-router-dom';
import { db } from '../Firebase';
import { Trendcard } from '../components/Trendcard';
import '../styles/Dashboard.css'
import { Searchitem } from '../components/Searchitem';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


export const Dashboard = () => {
  const [displayName, setDisplayName] = useState('');
  const { logout, currentUser, setUserData, moreInfoData, coinInfo, detailedInfo, graphLimit, saveCoin, graphBegin } = useAuth();
  const [toggle, setToggle] = useState(false)
  const [trending, setTrending] = useState([]);
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(5);
  const [data, setData] = useState([]);
  const moreInfoRef = useRef(null);
  const history = useNavigate();
  const redirect = (path) => {
    history(path)
  }


  useEffect(()=>{
    //fetch("https://api.coingecko.com/api/v3/search/trending").then(res => res.json()).then(data => setTrending(data.coins));
    //currentUser && db.collection('users').doc(currentUser._delegate.uid).get().then(doc => {
    //  setDisplayName(doc.data().firstname);
    //  setUserData(doc.data());
    //})


  },[])
 
  const queryChange = (e)=>{
    setQuery(e.target.value)
  }

  const handleQuery = (e) =>{
    e.preventDefault()
    fetch('https://api.coingecko.com/api/v3/search?query=' + query).then(res => res.json()).then(data=> setData(data.coins))
  }

  const showMore = () => {
    setLimit(limit + 4);
    if(limit >= data.length){
      setToggle(false)
    }
  }



  const handleLogOut = async (e) => {
    e.preventDefault();
    await logout();
    await redirect('/');

  }
  
  return (
    <div className='dashboard-container'>
      <h1>Welcome {displayName}</h1>
    <div>Dashboard</div>
    
    <button type='submit' onClick={handleLogOut}>Log out</button>
    <div className='trending-div'>
    <h2>Checkout Today's Trending coins</h2>
      
   <div className='trending-coins'> {
      trending.map((coin) => (
        <Trendcard
         name={coin.item.name}
         image={coin.item.small}
         price={coin.item.price_btc}
         rank={coin.item.market_cap_rank}
        />
      ))
    }</div>
    </div>
    <div className='search-form'>
      <form className='search'>
        <input type="search" name='query' placeholder='search' className='form-input' onChange={queryChange}/>
          <button className='search-button' onClick={handleQuery}>search</button>
      </form>
    </div>
    <div>
      <div className='search-container'>
      {data && <div>
        {data.slice(0, limit).map((item) => (
        <Searchitem
        name={item.name}
        img={item.large}
        id={item.id}
        moreInfoRef={moreInfoRef}
         />
      ))}
        </div>}
        {toggle ? <button onClick={showMore}>Show more</button> : <></>}
    </div>
    </div>
    <div ref={moreInfoRef} className='more-info'>
      
      
      {moreInfoData && <div>
        <div className='button div'>
            <button onClick={()=> {saveCoin(coinInfo)}}>Save coin!</button>
          </div>
        <div className='more-info-title'>
        <h1>{detailedInfo.name}</h1>
        <img src={detailedInfo.image.large} alt='coinImage' className='more-info-image'/>
        
        </div>
        <div className='more-info-container'>
         
          
          <div className='description-container'dangerouslySetInnerHTML={{ __html: detailedInfo.description.en === '' ?`There is currently no description for ${detailedInfo.name} at the moment` : detailedInfo.description.en}}>
          </div> 
          <h3 style={{margin: '20px'}}>Description</h3>
        <div className='chart-container'>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={500}
          height={500}
          data={moreInfoData}
          margin={{
            top: 10,
            right: 30,
            left: 10,
            bottom: 10,
          }}
        >
          <defs>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="20%" stopColor="#FF0000" stopOpacity={0.3}/>
              <stop offset="80%" stopColor="#FF0000" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="time" axisLine={false} tickLine={false} label={{ value: 'Date', position: 'insideBottom', offset: -10 }}  />
          <YAxis User
tickFormatter={(value) => value.toFixed(0)} axisLine={false} tickLine={false} label={{ value: 'Price(GBP)', angle: -90, position: 'insideLeft', offset: -5, dy: 20}}
          domain={[graphBegin, graphLimit]}/>
        <Tooltip />
          <Area type="monotone" dataKey="price" stroke="#FF0000" fillOpacity={1} fill="url(#colorPv)" strokeWidth={3} />
        </AreaChart>
      </ResponsiveContainer>
      </div>
      <h3>Historical market data for the last year</h3>
      </div>

      </div>}
      
    </div>
    
    
    </div>
  )
}
