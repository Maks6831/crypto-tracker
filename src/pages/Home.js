import React, { useRef, useState } from "react";
import { useAuth } from "../contexts/Authcontext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Home = () =>{ 
    const email = useRef();
    const password = useRef();
    const fullname = useRef();
    const passconf = useRef();
    const { signup, currentUser } = useAuth();
    const [error, setError] = useState('')
    const history = useNavigate();

    const redirect = (path) => {
        history(path);
    }

    const passwordCheck = (a, b) => {
        return a === b 
    }

    const handleSubmit =  async (e) => {
        e.preventDefault()
        if(passwordCheck(password.current.value, passconf.current.value)){
            try {
                 await signup(email.current.value, password.current.value, fullname.current.value)
                 await redirect('/Dashboard');
            } catch {
                setError('We could not create an account')
            }

        } else {
            setError("passwords do not match");
        }

    }
    return (
        <div>
        <h1>Sign up</h1>
        <form>
        <div>
                <label for="fullname">Enter your full name</label>
                <input type="text" name="fullname" ref={fullname}/>
            </div>
            <div>
                <label for="email">Enter your email</label>
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
