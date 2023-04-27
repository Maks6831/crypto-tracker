import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Home from './pages/Home';
import { useAuth } from './contexts/Authcontext';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Sidebar } from './components/Sidebar';
import { Mycoins } from './pages/Mycoins';

function App() {
  const { currentUser } = useAuth()
  return (
    
      <Router>
      <div>
        {!currentUser ?
        <><Header /><Routes>
              <Route path="/" element={<Home />} />
              <Route path='/login' element={<Login />} />
              <Route path='/dashboard' element={<Dashboard />} />
            </Routes></>
         : 
         <Sidebar>
          <Routes>
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/mycoins' element={<Mycoins/>} />
            </Routes>
         </Sidebar>

        }
        
      </div>
    </Router>
    
  );
}

export default App;
