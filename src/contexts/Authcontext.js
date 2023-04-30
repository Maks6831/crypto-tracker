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
    const [coinInfo, setCoinInfo] = useState(null);
    const [detailedInfo, setDetailedInfo] = useState();
    const [graphLimit, setGraphLimit] = useState(null);

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

    const saveCoin = (id) => {
      console.log(id);
      //   db.collection('users').doc(currentUser._delegate.uid).update({
      //     coins: firebase.firestore.FieldValue.arrayUnion(id)
      //   });
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
        setMoreInfoData,
        coinInfo,
        setCoinInfo,
        detailedInfo,
        setDetailedInfo,
        graphLimit,
        setGraphLimit,
        saveCoin
    }

  return (
    <Authcontext.Provider value={value}>
      {children}  
    </Authcontext.Provider>
  )
}
