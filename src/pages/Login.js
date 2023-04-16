import React from 'react'
import { useRef, useState } from 'react';
import { useAuth } from "../contexts/Authcontext";
import { Link, useNavigate } from 'react-router-dom';

export const Login = () => {
    const email = useRef();
    const password = useRef();
    const passconf = useRef();
    const { login, currentUser, logout } = useAuth();
    const [error, setError] = useState('')
    const history = useNavigate();
    console.log(currentUser);

    const redirect = path => {
        history(path);
      }

    const handleLogOut = async (e) =>{
        e.preventDefault();
        setError('');
        try {
            await logout()
            redirect("/");  
        } catch {
            setError('Failed to log out!');

        }
    }

    const handleLogin = (e) => {
        e.preventDefault()
        
        password.current.value ? login(email.current.value, password.current.value): setError("passwords do not match");
        redirect("/Dashboard");
    }
  return (
    <div>
        <form>
            <div>
                <label for="email">Enter you email</label>
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
