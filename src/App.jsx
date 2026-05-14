import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './components/DashboardLayout';
import Overview from './components/Overview';
import Schools from './components/Schools';
import SchoolDetail from './components/SchoolDetail';
import Sessions from './components/Sessions';
import Revenue from './components/Revenue';
import Subscriptions from './components/Subscriptions';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="schools" element={<Schools />} />
          <Route path="sessions" element={<Sessions />} />
          <Route path="revenue" element={<Revenue />} />
          <Route path="subscriptions" element={<Subscriptions />} />
        </Route>
        <Route path="/admin" element={<DashboardLayout />}>
          <Route path="schools/:id" element={<SchoolDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
