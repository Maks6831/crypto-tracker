import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Home from './pages/Home';
import { Authprovider } from './contexts/Authcontext';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';

function App() {
  return (
    <Authprovider>
      <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path='/Dashboard' element={<Dashboard/>}/>
          <Route path='/login' element={<Login/>}/>
        </Routes>
      </div>
    </Router>
    </Authprovider>
    
  );
}

export default App;
