// admin-frontend/src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminDashboard from './App.tsx'; // Your current list component
import BookingDetail from './BookingDetail.tsx'; // Component we will create
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        {/* The dynamic route for viewing/editing a specific booking */}
        <Route path="/booking/:id" element={<BookingDetail />} /> 
        {/* Optional: Add a 404 page */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)