// admin-frontend/src/App.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

// 1. FIX: BookingSummary Interface (was missing, causing errors)
interface BookingSummary {
  id: number;
  full_name: string;
  rental_service_name: string;
  pickup_date: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'; 
  created_at: string;
}

// Placeholder for Admin Auth Header (KEEP THIS FOR SECURITY LATER)
const ADMIN_AUTH_HEADER = { 'Authorization': 'Bearer VALID_ADMIN_TOKEN' }; 

function AdminDashboard() {
  const [bookings, setBookings] = useState<BookingSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to determine badge color based on status (Polished Styling)
  const getStatusBadge = (status: BookingSummary['status']) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800 border-green-400';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-400';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800 border-blue-400';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-400';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 2. FIX: Define the complete fetch logic using useCallback
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // API Call: Using the security header placeholder
      const response = await fetch('/api/admin/bookings', {
          headers: ADMIN_AUTH_HEADER, 
      }); 
      
      if (!response.ok) {
        if (response.status === 403) {
            // This error is expected until we disable the Worker's security check for local testing
            throw new Error("Unauthorized: Worker rejected access (403). Check Worker security logic.");
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const json: BookingSummary[] = await response.json();
      setBookings(json);
    } catch (e) {
      // Catch any errors (e.g., network, JSON parsing, API status errors)
      setError(e instanceof Error ? e.message : "An unknown error occurred during fetch.");
    } finally {
      // CRITICAL: Always resolve the loading state
      setLoading(false); 
    }
  }, []); // Function definition is stable

  // 3. FIX: Call the fetch logic using useEffect
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]); // Calls fetchBookings once on mount

  if (loading) return <h1 className="text-center mt-20 text-xl font-semibold">Loading Admin Dashboard...</h1>;
  if (error) return <h1 style={{color: 'red'}} className="text-center mt-20 text-xl font-semibold">Error: {error}</h1>;

  return (
    // Polished Layout Starts Here
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden p-8">
        
        <h2 className="text-4xl font-extrabold mb-8 text-gray-900 border-b pb-4">
          🚗 Road Roam Admin Dashboard
        </h2>
        <p className="text-lg text-gray-600 mb-6">
            Showing {bookings.length} Total Bookings
        </p>

        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto border border-gray-200 rounded-xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Booked On</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {bookings.map(booking => (
                <tr key={booking.id} className="hover:bg-blue-50 transition duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{booking.full_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{booking.rental_service_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusBadge(booking.status)}`}>
                          {booking.status}
                      </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(booking.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <Link to={`/booking/${booking.id}`} className="text-indigo-600 hover:text-indigo-800 font-semibold transition">
                          View / Edit
                      </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;