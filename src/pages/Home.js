import React, { useRef, useState } from "react";
import { useAuth } from "../contexts/Authcontext";
import { Link } from "react-router-dom";

const Home = () =>{ 
    const email = useRef();
    const password = useRef();
    const passconf = useRef();
    const { signup, currentUser } = useAuth();
    const [error, setError] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        password.current.value === passconf.current.value ? signup(email.current.value, password.current.value): setError("passwords do not match");

    }
    return (
        <div>
        <h1>Sign up</h1>
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
            <label for="passconf">Password confirmation</label>
            <input type="password" name="passconf" ref={passconf}/> 
            </div>
            <div>
                <button type="submit" onClick={handleSubmit}>Sign up</button>
            </div>
        </form>
        <div>Already have an account? <Link to='/login'>login</Link></div>
        <div>{error}</div>
        <div>{currentUser && currentUser.email}</div>

        </div>
    )
}

export default Home;
