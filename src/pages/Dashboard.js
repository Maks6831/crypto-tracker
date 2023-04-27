import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/Authcontext'
import { useNavigate } from 'react-router-dom';
import { db } from '../Firebase';
import { Trendcard } from '../components/Trendcard';
import '../styles/Dashboard.css'
import { Searchitem } from '../components/Searchitem';

export const Dashboard = () => {
  const [displayName, setDisplayName] = useState('');
  const { logout, currentUser, setUserData } = useAuth();
  const [toggle, setToggle] = useState(false)
  const [trending, setTrending] = useState([]);
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(5);
  const [data, setData] = useState([]);
  const history = useNavigate();
  const redirect = (path) => {
    history(path)
  }
 currentUser && db.collection('users').doc(currentUser._delegate.uid).get().then(doc => {
    setDisplayName(doc.data().firstname);
    setUserData(doc.data());
  })

  useEffect(()=>{
    fetch("https://api.coingecko.com/api/v3/search/trending").then(res => res.json()).then(data => setTrending(data.coins));


  },[])
  useEffect(()=>{
    fetch("https://api.coingecko.com/api/v3/search/trending").then(res => res.json()).then(data => setTrending(data.coins));


  },[])
 
  const queryChange = (e)=>{
    setQuery(e.target.value)
    console.log(query)
  }

  const handleQuery = (e) =>{
    e.preventDefault()
    fetch('https://api.coingecko.com/api/v3/search?query=' + query).then(res => res.json()).then(data=> setData(data.coins))
    data !== [] ? console.log(data) : console.log('empty');
    setToggle(true)
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
          <button onClick={handleQuery}>search</button>
      </form>
    </div>
    <div>
      {data && data.slice(0, limit).map((item) => (
        <Searchitem
        name={item.name}
        img={item.large}
        id={item.id}
         />
      ))
        }
        {toggle ? <button onClick={showMore}>Show more</button> : <></>}
      
      
    </div>
    
    
    </div>
  )
}
