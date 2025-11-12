// admin-frontend/src/App.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

// --- PRODUCTION CONFIGURATION ---
const API_ROOT = import.meta.env.VITE_API_ROOT || '';
// --------------------------------

// 1. INTERFACE
interface BookingSummary {
  id: number;
  full_name: string;
  rental_service_name: string;
  pickup_date: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'; 
  created_at: string;
}

// Placeholder for Admin Auth Header
const ADMIN_AUTH_HEADER = { 'Authorization': 'Bearer VALID_ADMIN_TOKEN' }; 

function AdminDashboard() {
  const [bookings, setBookings] = useState<BookingSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // --- NEW STATE for confirmation modals ---
  const [showConfirmModal, setShowConfirmModal] = useState<{ 
    message: string, 
    onConfirm: () => void, 
    type: 'warning' | 'danger' 
  } | null>(null);

  // Function to determine badge color (High Contrast Styling)
  const getStatusBadge = (status: BookingSummary['status']) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-600 text-white font-bold';
      case 'CANCELLED': return 'bg-red-600 text-white font-bold';
      case 'COMPLETED': return 'bg-blue-600 text-white font-bold';
      case 'PENDING': return 'bg-yellow-500 text-gray-900 font-bold';
      default: return 'bg-gray-600 text-white';
    }
  };

  // 2. DATA FETCHING LOGIC (remains the same)
  const fetchBookings = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const endpoint = `${API_ROOT}/api/admin/bookings`;
      const response = await fetch(endpoint, { headers: ADMIN_AUTH_HEADER }); 
      
      if (!response.ok) {
        if (response.status === 403) {
            throw new Error(`Unauthorized (403): Check Worker security logic.`);
        }
        if (response.headers.get('content-type')?.includes('text/html')) {
            throw new Error(`Failed to load JSON: Server sent HTML instead (check URL: ${endpoint})`);
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const json: BookingSummary[] = await response.json();
      setBookings(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unknown error occurred during fetch.");
    } finally {
      setLoading(false); 
    }
  }, []); 

  // 3. LIFECYCLE HOOK (remains the same)
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]); 

  // Polished Loading State
  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <h1 className="text-xl font-semibold text-white">Loading Admin Dashboard...</h1>
    </div>
  );
  
  // Polished Error State
  if (error) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl border border-red-600">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Bookings</h1>
        <p className="text-gray-300 font-mono bg-gray-900 p-4 rounded">{error}</p>
      </div>
    </div>
  );

  return (
    // We wrap everything in a Fragment so the modal can be a sibling
    <>
     {/* --- NEW GLOBAL CONFIRMATION MODAL (ENHANCED STYLING) --- */}
      {showConfirmModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" // Darker overlay, blur, fade-in animation
          onClick={() => setShowConfirmModal(null)} 
        >
          <div 
            className="bg-gray-800 rounded-xl shadow-2xl p-8 max-w-md w-full border border-gray-700 transform scale-95 animate-scale-in" // Larger, rounded, scaled-in animation
            onClick={(e) => e.stopPropagation()} 
          >
            <h2 className="text-2xl font-bold mb-4 text-white">
              {showConfirmModal.type === 'danger' && <span className="mr-2 text-red-500">⚠</span>}
              {showConfirmModal.type === 'warning' && <span className="mr-2 text-yellow-500">❗</span>}
              {showConfirmModal.message}
            </h2>
            
            <p className="text-gray-300 text-md mb-6">
                Please confirm your action. This operation cannot be undone.
            </p>

            <div className="flex justify-end space-x-3">
              
              {/* Cancel Button */}
              <button
                onClick={() => setShowConfirmModal(null)}
                className="px-6 py-2 bg-gray-700 text-gray-300 font-semibold rounded-lg hover:bg-gray-600 hover:text-white transition duration-200"
              >
                Cancel
              </button>
              
              {/* Confirm/OK Button */}
              <button
                onClick={() => {
                  showConfirmModal.onConfirm();
                  setShowConfirmModal(null); 
                }}
                className={`px-6 py-2 rounded-lg text-white font-bold transition duration-200 
                          ${showConfirmModal.type === 'warning' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
              >
                {showConfirmModal.type === 'warning' ? 'Confirm' : 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Polished Layout: Dark background */}
      <div className="min-h-screen bg-gray-900 p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          
          {/* --- HEADER SECTION (WRAPPED IN FLEX) --- */}
          <div className="flex flex-col md:flex-row justify-between mb-8 space-y-4 md:space-y-0 md:items-start">
            
            {/* Column 1: Logo and Title */}
            <div>
              <h1 className="text-5xl font-extrabold text-white mb-2">
                <span className="text-gray-200">Road</span>
                <span className="text-red-600">Roam</span> Admin
              </h1>
              <p className="text-lg text-gray-400">
                  {bookings.length} Total Bookings - Data Management Console
              </p>
            </div>

            {/* Column 2: Logout Button & Export Button */}
            <div className="flex space-x-8 mt-2">
              
              {/* CRITICAL FIX: Export Button with client-side check modal */}
              <a 
                  onClick={() => {
                      if (bookings.length === 0) {
                          // Show custom error modal if data is empty
                          setShowConfirmModal({
                              message: "Export Error: Cannot export. No records found in the database.",
                              type: 'danger',
                              onConfirm: () => {}, // No action needed on 'OK'
                          }); 
                          return;
                      }
                      
                      // Show confirmation modal if data exists
                      setShowConfirmModal({
                          message: `Confirm export of ${bookings.length} record(s)? This will download a CSV file.`,
                          type: 'warning',
                          onConfirm: () => {
                              // This runs when 'Proceed' is clicked
                              window.location.href = `${API_ROOT}/api/admin/export`;
                          }
                      });
                  }}
                  // Changed href to '#' to ensure onClick logic is followed
                  href="#" 
                  className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg shadow hover:bg-green-700 transition flex-shrink-0 text-center cursor-pointer"
              >
                  Export to Excel 📄
              </a>

              
              {/* Logout Button with Confirmation Modal */}
              <a 
                onClick={() => {
                    setShowConfirmModal({
                        message: "Are you sure you want to securely log out of the dashboard?",
                        type: 'danger',
                        onConfirm: () => {
                            window.location.href = "https://admin.roadroam.in/cdn-cgi/access/logout";
                        }
                    });
                }}
                href="#" // Changed href to '#'
                className="px-6 py-2 bg-gray-600 text-white font-bold rounded-lg shadow hover:bg-gray-700 transition flex-shrink-0 text-center cursor-pointer"
              >
                Logout
              </a>
            </div>
          </div>
          {/* --- END HEADER SECTION --- */}


          {/* Main Content Card (Table Wrapper) */}
          <div className="bg-gray-800 shadow-2xl rounded-lg overflow-hidden border border-gray-700">
            <div className="p-6">
              <h2 className="text-3xl font-bold text-white mb-1 border-b border-red-600 pb-2">Booking List</h2>
            </div>
            
            {/* Display empty state message when no records exist */}
            {bookings.length === 0 && !loading && (
                <div className="p-6 text-center">
                    <p className="text-xl font-medium text-gray-400">No active bookings found.</p>
                </div>
            )}


            {/* Responsive Table Wrapper */}
            {bookings.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                      {/* Table Head (Darker than the body) */}
                      <thead className="bg-gray-900">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Customer / ID</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Service</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Booked On</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Pick Up</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      {/* Table Body */}
                      <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {bookings.map(booking => (
                          <tr key={booking.id} className="hover:bg-gray-700 transition duration-150">
                            
                            {/* Customer Name and ID */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-white">{booking.full_name}</div>
                              <div className="text-xs text-gray-400">Booking ID: {booking.id}</div>
                            </td>
                            
                            {/* Service */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{booking.rental_service_name}</td>
                            
                            {/* Status Badge (High Contrast) */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${getStatusBadge(booking.status)}`}>
                                    {booking.status}
                                </span>
                            </td>
                            
                            {/* Date */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{new Date(booking.created_at).toLocaleDateString()}</td>

                            {/* Pick-Up */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{new Date(booking.pickup_date).toLocaleDateString()}</td>
                            
                            {/* Action Button (Red contrast) */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                <Link 
                                  to={`/booking/${booking.id}`} 
                                  className="text-red-500 hover:text-red-400 font-semibold transition"
                                >
                                    View 
                                </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;