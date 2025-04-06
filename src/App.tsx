import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login'; // Renamed SignIn to Login
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Insights from './pages/Insights';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} /> {/* Default route */}
        <Route path="/login" element={<Login />} /> {/* Changed from /signin to /login */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} /> {/* Todo list route */}
        <Route path="/insights" element={<Insights />} />
      </Routes>
    </Router>
  );
};

export default App;