// admin-frontend/src/BookingDetail.tsx (Fully Polished Code)

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Reusing interfaces from the Worker (Best Practice)
interface BookingRecord {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  aadhar_number: string | null;
  rental_service_name: string;
  pickup_date: string;
  return_date: string;
  pickup_location: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  created_at: string;
}

// Define the allowed rental services for the dropdown
const rentalServices = [
  "Airport Pickup", "In-City Rental", "Outstation Rental", 
  "Corporate Rentals", "Event Rentals"
];

// Placeholder for Admin Auth Header (needed for all admin API calls)
const ADMIN_AUTH_HEADER = { 'Authorization': 'Bearer VALID_ADMIN_TOKEN' }; 

const BookingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [formData, setFormData] = useState<Partial<BookingRecord>>({}); // Holds editable form data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // --- Utility Functions ---

  const getStatusBadge = (status: BookingRecord['status']) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800 border-green-400';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-400';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800 border-blue-400';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-400';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // --- Data Fetching Logic ---
  const fetchBooking = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/bookings/${id}`, { headers: ADMIN_AUTH_HEADER });
      
      if (response.status === 404) throw new Error("Booking not found.");
      if (!response.ok) throw new Error(`Failed to fetch booking: ${response.status}`);

      const data: BookingRecord = await response.json();
      setBooking(data);
      setFormData(data); 
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unknown fetch error occurred.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  // --- Form Change Handler ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // --- Core Action 1: Update Booking Details (PATCH) ---
  const handleUpdateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;
    
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: {
            ...ADMIN_AUTH_HEADER,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), 
      });

      if (!response.ok) {
        throw new Error('Failed to update details. Check console for API error.');
      }
      
      alert('Booking successfully updated!');
      await fetchBooking(); 
    } catch (e) {
      alert(`Update failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };
  
  // --- Core Action 2: Delete Booking (DELETE) ---
  const handleDeleteBooking = async () => {
    if (!booking) return;

    const confirmed = confirm(`Are you sure you want to permanently delete Booking #${booking.id} (${booking.full_name})? This action cannot be undone.`);
    
    if (!confirmed) return;

    setIsSaving(true); 
    try {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: 'DELETE',
        headers: ADMIN_AUTH_HEADER,
      });

      if (response.status === 404) throw new Error("Booking not found.");
      if (!response.ok) throw new Error('Failed to delete booking.');
      
      alert(`Booking #${booking.id} successfully deleted.`);
      navigate('/'); 
    } catch (e) {
      alert(`Deletion failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
      setIsSaving(false);
    }
  };

  if (loading) return <h1 className="text-center mt-20 text-xl font-semibold">Loading Booking Details...</h1>;
  if (error) return <h1 style={{color: 'red'}} className="text-center mt-20 text-xl font-semibold">Error: {error}</h1>;
  if (!booking || !formData) return <h1 className="text-center mt-20 text-xl font-semibold">Booking Not Found.</h1>;

  return (
    // POLISH: Main container setup
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-8">
      
        <button onClick={() => navigate('/')} className="mb-6 text-indigo-600 hover:text-indigo-800 font-medium transition flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Dashboard
        </button>
      
        <h1 className="text-4xl font-extrabold mb-2 text-gray-900">
            Edit Booking #{booking.id}
        </h1>
        <p className="text-lg text-gray-600 mb-6">Booked On: {new Date(booking.created_at).toLocaleString()}</p>
        
        {/* Status Management */}
        <div className="flex items-center justify-between p-4 mb-8 bg-indigo-50 border-l-4 border-indigo-500 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800">Current Status: 
            <span className={`ml-3 px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full border ${getStatusBadge(booking.status)}`}>
                {booking.status}
            </span>
          </h2>
          <div className="flex items-center space-x-4">
            <select
              id="status-select"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              disabled={isSaving}
            >
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </div>
        </div>
      
        <form onSubmit={handleUpdateBooking} className="space-y-8">
            
            {/* Full Details Edit Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <h2 className="col-span-full text-2xl font-bold border-b pb-3 mb-4 text-indigo-700">Customer Information</h2>
                
                <InputField label="Full Name" type="text" name="full_name" value={formData.full_name || ''} onChange={handleChange} />
                <InputField label="Email" type="email" name="email" value={formData.email || ''} onChange={handleChange} />
                <InputField label="Phone Number" type="tel" name="phone_number" value={formData.phone_number || ''} onChange={handleChange} />
                <InputField label="Aadhar Number" type="text" name="aadhar_number" value={formData.aadhar_number || ''} onChange={handleChange} />

                <h2 className="col-span-full text-2xl font-bold border-b pb-3 mb-4 pt-6 text-indigo-700">Rental & Timing</h2>

                {/* Rental Service Dropdown */}
                <div>
                  <label htmlFor="rental_service_name" className="block text-sm font-medium text-gray-700 mb-1">Rental Service</label>
                  <select
                    id="rental_service_name"
                    name="rental_service_name"
                    value={formData.rental_service_name || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {rentalServices.map(service => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
                </div>
                
                <InputField label="Pick-up Location" type="text" name="pickup_location" value={formData.pickup_location || ''} onChange={handleChange} />
                <InputField label="Pick-up Date" type="date" name="pickup_date" value={formData.pickup_date || ''} onChange={handleChange} />
                <InputField label="Return Date" type="date" name="return_date" value={formData.return_date || ''} onChange={handleChange} />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-8 border-t border-gray-200 mt-8">
                <button
                    type="submit"
                    disabled={isSaving}
                    className={`px-8 py-3 rounded-xl font-bold text-lg shadow-md transition text-white ${
                      isSaving 
                        ? 'bg-yellow-500 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300'
                    }`}
                >
                    {isSaving ? 'Saving Changes...' : 'Save All Changes'}
                </button>
                
                <button
                    type="button" 
                    onClick={handleDeleteBooking}
                    disabled={isSaving}
                    className={`px-8 py-3 rounded-xl font-bold text-lg shadow-md transition text-white ${
                        isSaving ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300'
                    }`}
                >
                    Delete Booking
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

// --- InputField Helper Component (Reused and Updated) ---
interface InputFieldProps {
  label: string;
  type: string;
  name: keyof BookingRecord; 
  value: string | number | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({ label, type, name, value, onChange }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      id={name}
      type={type}
      name={name}
      value={value === null || value === undefined ? '' : value}
      onChange={onChange}
      // POLISH: Applied professional input styles
      className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
    />
  </div>
);

export default BookingDetail;