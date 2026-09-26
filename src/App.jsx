import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RewardsProvider } from './context/RewardsContext';
import LevelDashboard from './pages/LevelDashboard';

export default function App() {
  return (
    <RewardsProvider>
      <BrowserRouter>
        <Routes>
          {/* Mandatory requirement: dashboard must work at /Lvl-Dashboard */}
          <Route path="/Lvl-Dashboard" element={<LevelDashboard />} />
          
          {/* Root redirect to /Lvl-Dashboard */}
          <Route path="/" element={<Navigate to="/Lvl-Dashboard" replace />} />
          
          {/* Wildcard redirect to ensure reliable navigation */}
          <Route path="*" element={<Navigate to="/Lvl-Dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </RewardsProvider>
  );
}
