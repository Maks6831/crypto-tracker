import React, { useEffect } from 'react'
import { useRef, useState } from 'react';
import { useAuth } from "../contexts/Authcontext";
import { Link, useNavigate } from 'react-router-dom';

export const Login = () => {
    const email = useRef();
    const password = useRef();
    const { login, currentUser, logout } = useAuth();
    const [error, setError] = useState('')
    const history = useNavigate();
    const redirect = path => {
        history(path);
      }
    useEffect(()=>{
       
    currentUser ? redirect('/dashboard') : console.log('not logged in');
    },[currentUser])
    

    

    const handleLogOut = async (e) =>{
        e.preventDefault();
        try {
            await logout()
            redirect("/");  
        } catch {
            setError('Failed to log out!');

        }
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            await login(email.current.value, password.current.value) &&
            redirect('/dashboard')
        } catch (err){
            setError("incorrect password or no user record" + err);
        }
    }
  return (
    <div>
        <form>
            <div>
                <label for="email">Enter your email</label>
                <input type="text" name="email" ref={email}/>
            </div>
            <div>
            <label for="password">Enter password</label>
            <input type="password" name="password" ref={password}/> 
            </div>
            <div>
                <button type="submit" onClick={handleLogin}>Log In</button>
                <button type="submit" onClick={handleLogOut}>Log Out</button>
            </div>
        </form>
        <div>Dont have an account? <Link to='/'>Sign Up</Link></div>
        <div>{error}</div>
        <div>{currentUser && currentUser.email}</div>
    </div>
  )
}
