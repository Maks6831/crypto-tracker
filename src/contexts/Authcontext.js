import React, { useContext, useEffect, useState } from 'react'
import { auth } from '../Firebase';
import { db } from '../Firebase';


const Authcontext = React.createContext();

export const useAuth = () => {
    return useContext(Authcontext)
}


export const Authprovider  = ({children}) => {
    const [currentUser, setCurrentUser] = useState();
    const [userData, setUserData] = useState();
    const [moreInfoData, setMoreInfoData] = useState();

    const signup = (email, password, firstname, lastname) =>{
        auth.createUserWithEmailAndPassword(email, password).then(cred => {
          return db.collection('users').doc(cred.user.uid).set({
            firstname: firstname,
            lastname: lastname,
            created: new Date(),
            coins: []
          })
        }).then(()=>{})
    }

    const login = (email, password) => {
      auth.signInWithEmailAndPassword(email, password)
    }

    const logout = ()=>{
      return auth.signOut();
    }


    

    useEffect(()=>{

        const unsubscribe = auth.onAuthStateChanged(user =>{
            setCurrentUser(user)

            return unsubscribe
        })
    },[])
    const value = {
        currentUser,
        signup,
        login,
        logout,
        userData,
        setUserData,
        moreInfoData,
        setMoreInfoData

    }

  return (
    <Authcontext.Provider value={value}>
      {children}  
    </Authcontext.Provider>
  )
}
