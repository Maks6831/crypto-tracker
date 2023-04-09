import React, { useContext, useEffect, useState } from 'react'
import { auth } from '../Firebase';
const Authcontext = React.createContext();

export const useAuth = () => {
    return useContext(Authcontext)
}

export const Authprovider  = ({children}) => {
    const [currentUser, setCurrentUser] = useState();

    const signup = (email, password) =>{
        auth.createUserWithEmailAndPassword(email, password)
    }

    useEffect(()=>{

        const unsubscribe = auth.onAuthStateChanged(user =>{
            setCurrentUser(user)

            return unsubscribe
        })
    },[])
    const value = {
        currentUser,
        signup
    }

  return (
    <Authcontext.Provider value={value}>
      {children}  
    </Authcontext.Provider>
  )
}
