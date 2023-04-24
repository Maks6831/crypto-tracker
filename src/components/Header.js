import React from "react";
import Navbar from "./Navbar";
import { useAuth } from "../contexts/Authcontext";


const Header = () =>{
    const { currentUser } = useAuth();
    return ( <div>
        {!currentUser && <Navbar/>}
        </div>
    )
}

export default Header;