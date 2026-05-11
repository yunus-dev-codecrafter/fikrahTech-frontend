import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/schools" element={<Dashboard />} />
        <Route path="/dashboard/sessions" element={<Dashboard />} />
        <Route path="/dashboard/revenue" element={<Dashboard />} />
        <Route path="/dashboard/subscriptions" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;