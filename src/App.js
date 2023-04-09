import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Home from './pages/Home';
import { Authprovider } from './contexts/Authcontext';

function App() {
  return (
    <Authprovider>
      <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />}/>
        </Routes>
      </div>
    </Router>
    </Authprovider>
    
  );
}

export default App;
