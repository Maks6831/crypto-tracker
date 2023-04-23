import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/Authcontext'
import { useNavigate } from 'react-router-dom';
import { db } from '../Firebase';

export const Dashboard = () => {
  const [displayName, setDisplayName] = useState('');
  const { logout, currentUser } = useAuth();
  const history = useNavigate();
  const redirect = (path) => {
    history(path)
  }
 currentUser && db.collection('users').doc(currentUser._delegate.uid).get().then(doc => {
    setDisplayName(doc.data().firstname);
  })



  const handleLogOut = async (e) => {
    e.preventDefault();
    await logout();
    await redirect('/');

  }
  return (
    <div>
      <h1>Welcome {displayName}</h1>
    <div>Dashboard</div>
    <button type='submit' onClick={handleLogOut}>Log out</button>
    </div>
  )
}
