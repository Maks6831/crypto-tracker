import React from 'react'
import { useAuth } from '../contexts/Authcontext'
import useNavigat 

export const Dashboard = () => {
  const { logout } = useAuth();

  const handleLogOut = async (e) => {
    e.preventDefault();
    await logout();

  }
  return (
    <div>
    <div>Dashboard</div>
    <button type='submit' onClick={handleLogOut}>Log out</button>
    </div>
  )
}
