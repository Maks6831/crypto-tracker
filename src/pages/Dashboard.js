import React from 'react'
import { useAuth } from '../contexts/Authcontext'
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const { logout } = useAuth();
  const history = useNavigate();
  const redirect = (path) => {
    history(path)
  }

  const handleLogOut = async (e) => {
    e.preventDefault();
    await logout();
    await redirect('/');

  }
  return (
    <div>
    <div>Dashboard</div>
    <button type='submit' onClick={handleLogOut}>Log out</button>
    </div>
  )
}
