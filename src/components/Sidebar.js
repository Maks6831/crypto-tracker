import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaHome, FaCoins, FaBars } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.css';

const routes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: <FaHome/>,
  },
  {
    path: '/mycoins',
    name: 'My Coins',
    icon: <FaCoins/>,
  }
]

export const Sidebar = ({children}) => {
  const [ isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className='container'>
        <motion.div animate={{width: isOpen ? '250px' : '50px'}} className='sidebar'>
          <div className='title-section-sidebar'>
            {isOpen && <h1>Crypto Tracker</h1>}
            <div className={isOpen ? 'hamburger': 'hamburger-small'}>
              <FaBars onClick={toggle}/>
            </div>
          </div>
          <section className='routes'>
            {routes.map((route)=> (
              <NavLink to={route.path} key={route.name} className="links">
                <div className='icon'>
                  {route.icon}
                </div>
                {isOpen && <div className='link_text'>{route.name}</div>}
              </NavLink>
            ))}
          </section>
        </motion.div>
        <main>
            {children}
        </main>

    </div>
  )
}
