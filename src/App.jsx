import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import PresellFormPage from './pages/PresellFormPage';
import './index.css'; // Tailwind CSS

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/presells/new" element={<PresellFormPage />} />
          <Route path="/presells/edit/:id" element={<PresellFormPage />} />
          {/* Default route - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
