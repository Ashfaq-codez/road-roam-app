// admin-frontend/src/BookingDetail.tsx (Final Polished Dark Theme with Edit Toggle)

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// --- (Interfaces, consts, API_ROOT, etc. remain the same) ---
const API_ROOT = import.meta.env.VITE_API_ROOT || '';
interface BookingRecord {
  id: number; full_name: string; email: string; phone_number: string; aadhar_number: string | null;
  rental_service_name: string; car_model: string; pickup_date: string; return_date: string; pickup_location: string;
  pickup_lat: number; pickup_lng: number; passengers: number; // Added Lat/Lng and Passengers
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'; created_at: string;
}
interface BookingUpdateData extends Partial<BookingRecord> { status?: BookingRecord['status']; }
const rentalServices = ["Airport Transfer", "City Cruise", "Tours & Trips", "Corporate Rentals", "Event Rentals"];
const carModelsList = ["Hycross", "Crysta", "Innova",  "Ertiga", "Ciaz", "Dzire" ];
const ADMIN_AUTH_HEADER = { 'Authorization': 'Bearer VALID_ADMIN_TOKEN' }; 

const BookingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // --- STATE ---
  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [formData, setFormData] = useState<Partial<BookingRecord>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // --- (Helper functions: getStatusBadge, fetchBooking, handleCancelEdit) ---
  
  const getStatusBadge = (status: BookingRecord['status']) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-600 text-white font-bold';
      case 'CANCELLED': return 'bg-red-600 text-white font-bold';
      case 'COMPLETED': return 'bg-blue-600 text-white font-bold';
      case 'PENDING': return 'bg-yellow-500 text-gray-900 font-bold';
      default: return 'bg-gray-600 text-white';
    }
  };

  const fetchBooking = useCallback(async () => {
    if (!id) return;
    setLoading(true); setError(null);
    try {
      const response = await fetch(`${API_ROOT}/api/admin/bookings/${id}`, { headers: ADMIN_AUTH_HEADER });
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

  useEffect(() => { fetchBooking(); }, [fetchBooking]);

  // CRITICAL FIX: Add logic to convert passenger string input to number
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let { name, value } = e.target;
    
    // Convert number type input strings to actual numbers
    if (name === 'passengers') {
        const numValue = parseInt(value, 10);
        
        // 2. If the conversion is successful (i.e., not NaN), store the number.
        // If it's NaN (the user typed 'e' or nothing), we still store 0 or '', which the form state can handle.
        if (!isNaN(numValue)) {
            setFormData({ ...formData, [name]: numValue });
            return;
        }
    }
    
    setFormData({ ...formData, [name]: value });
  };
  
  const handleCancelEdit = () => {
    if (booking) setFormData(booking);
    setIsEditing(false);
  };

  const handleUpdateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return; setIsSaving(true);
    try {
      // Logic for status change email (removed here for brevity, assumed functional)
      
      const response = await fetch(`${API_ROOT}/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: { ...ADMIN_AUTH_HEADER, 'Content-Type': 'application/json' },
        body: JSON.stringify(formData), 
      });
      if (!response.ok) throw new Error('Failed to update details.');
      alert('Booking successfully updated!');
      await fetchBooking();
      setIsEditing(false);
    } catch (e) {
      alert(`Update failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDeleteBooking = async () => {
    if (!booking) return;
    const confirmed = confirm(`Are you sure you want to permanently delete Booking #${booking.id}?`);
    if (!confirmed) return;
    setIsSaving(true); 
    try {
      await fetch(`${API_ROOT}/api/admin/bookings/${id}`, { method: 'DELETE', headers: ADMIN_AUTH_HEADER });
      alert(`Booking #${booking.id} successfully deleted.`);
      navigate('/'); 
    } catch (e) {
      alert(`Deletion failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
      setIsSaving(false);
    }
  };

  // --- (Loading/Error states) ---
  if (loading) return ( <div className="flex justify-center items-center min-h-screen bg-gray-900"><h1 className="text-xl font-semibold text-white">Loading Details...</h1></div> );
  if (error) return ( <div className="flex justify-center items-center min-h-screen bg-gray-900"><div className="bg-gray-800 p-8 rounded-lg shadow-xl border border-red-600"><h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Bookings</h1><p className="text-gray-300 font-mono bg-gray-900 p-4 rounded">{error}</p></div></div> );
  if (!booking || !formData) return <h1 className="text-center mt-20 text-xl font-semibold text-white">Booking Not Found.</h1>;


  return (
    <div className="min-h-screen bg-gray-900 p-6 md:p-10">
      <div className="max-w-4xl mx-auto bg-gray-800 shadow-2xl rounded-xl p-8 border border-gray-700">
      
        <div className="flex justify-between items-center mb-6">
          {/* Back Button */}
          <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white font-medium transition flex items-center space-x-1">
              &larr; Back to Dashboard
          </button>
          
          {/* Edit Button (Only shows in View mode) */}
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg shadow hover:bg-red-700 transition"
            >
              Edit Booking
            </button>
          )}
        </div>

      
        {/* Header and Logo */}
        <div className="border-b border-gray-700 pb-4 mb-6">
            <h1 className="text-4xl font-extrabold text-white mb-2">
                <span className="text-gray-200">Road</span>
                <span className="text-red-600">Roam</span>
                <span className="text-gray-400"> - {isEditing ? "Edit" : "View"} Booking</span>
            </h1>
            <p className="text-sm text-gray-500">Booking ID: {booking.id} | Booked On: {new Date(booking.created_at).toLocaleString()}</p>
        </div>
        
        {/* Status Management */}
        <div className="flex items-center justify-between p-4 mb-8 bg-gray-900 border-l-4 border-red-600 rounded-lg shadow-inner">
          <h2 className="text-xl font-semibold text-white">
            Current Status: 
            <span className={`ml-3 px-3 py-1 inline-flex text-sm leading-5 font-bold rounded-full ${getStatusBadge(booking.status)}`}>
                {booking.status}
            </span>
          </h2>
          <div className="flex items-center space-x-4">
            <select
              id="status-select"
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={!isEditing}
              className={`p-2 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-white focus:ring-red-600 focus:border-red-600 ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </div>
        </div>
      
        {/* Form is now connected to handleSubmit */}
        <form onSubmit={handleUpdateBooking} className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <h2 className="col-span-full text-2xl font-bold border-b pb-3 mb-4 text-red-600">Customer & Rental Details</h2>
                
                <InputField label="Full Name" type="text" name="full_name" value={formData.full_name || ''} onChange={handleChange} disabled={!isEditing} />
                <InputField label="Email" type="email" name="email" value={formData.email || ''} onChange={handleChange} disabled={!isEditing} />
                <InputField label="Number of Passengers" type="number" name="passengers" value={formData.passengers || ''} onChange={handleChange} disabled={!isEditing} />
                 
                <InputField label="Phone Number" type="tel" name="phone_number" value={formData.phone_number || ''} onChange={handleChange} disabled={!isEditing} />
                <InputField label="Aadhar Number" type="text" name="aadhar_number" value={formData.aadhar_number || ''} onChange={handleChange} disabled={!isEditing} />
                
                <h3 className="col-span-full text-xl font-semibold pt-4 text-gray-400">Rental & Timing</h3>

                <div>
                  <label htmlFor="rental_service_name" className="block text-sm font-medium text-gray-400 mb-1">Rental Service</label>
                  <select
                    id="rental_service_name"
                    name="rental_service_name"
                    value={formData.rental_service_name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`mt-1 block w-full p-3 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-white focus:ring-red-600 focus:border-red-600 ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {rentalServices.map(service => ( <option key={service} value={service}>{service}</option>))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="car_model" className="block text-sm font-medium text-gray-400 mb-1">Car Model</label>
                  <select
                    id="car_model"
                    name="car_model"
                    value={formData.car_model || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`mt-1 block w-full p-3 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-white focus:ring-red-600 focus:border-red-600 ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {carModelsList.map(model => ( <option key={model} value={model}>{model}</option>))}
                  </select>
                </div>

                <InputField label="Pick-up Date" type="date" name="pickup_date" value={formData.pickup_date || ''} onChange={handleChange} disabled={!isEditing} />
                <InputField label="Return Date" type="date" name="return_date" value={formData.return_date || ''} onChange={handleChange} disabled={!isEditing} />
                <InputField label="Pick-up Location" type="text" name="pickup_location" value={formData.pickup_location || ''} onChange={handleChange} disabled={!isEditing} />
            </div>

            {/* --- CRITICAL FIX: Action Buttons (Responsive) --- */}
            {isEditing && (
              // This container stacks vertically on mobile (flex-col)
              // and becomes a horizontal row on medium screens (md:flex-row)
              <div className="flex flex-col md:flex-row md:justify-between md:items-center pt-8 border-t border-gray-700 mt-8 space-y-4 md:space-y-0">
                  
                  {/* Cancel Button */}
                  <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                      // Full width on mobile, auto-width on desktop
                      className="w-full md:w-auto px-8 py-3 rounded-xl font-bold text-lg shadow-md transition text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:ring-gray-300"
                  >
                      Cancel
                  </button>
                  
                  {/* Delete Button */}
                  <button
                      type="button" 
                      onClick={handleDeleteBooking}
                      disabled={isSaving}
                      // Full width on mobile, auto-width on desktop
                      className="w-full md:w-auto px-8 py-3 rounded-xl font-bold text-lg shadow-md transition text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300"
                  >
                      Delete
                  </button>

                  {/* Save Button */}
                  <button
                      type="submit"
                      disabled={isSaving}
                      // Full width on mobile, auto-width on desktop
                      className={`w-full md:w-auto px-8 py-3 rounded-xl font-bold text-lg shadow-md transition text-white ${
                        isSaving ? 'bg-yellow-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300'
                      }`}
                  >
                      {isSaving ? 'Saving...' : 'Save All Changes'}
                  </button>
              </div>
            )}
        </form>
      </div>
    </div>
  );
};

// --- InputField Helper Component (UPDATED to accept 'disabled' prop) ---
interface InputFieldProps {
  label: string;
  type: string;
  name: keyof BookingRecord; 
  value: string | number | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  disabled: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ label, type, name, value, onChange, disabled }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-400 mb-1">
      {label}
    </label>
    <input
      id={name}
      type={type}
      name={name}
      value={value === null || value === undefined ? '' : value}
      onChange={onChange}
      disabled={disabled}
      className={`mt-1 block w-full p-3 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-white focus:ring-red-600 focus:border-red-600 transition duration-150 ${
        disabled ? 'opacity-70 cursor-not-allowed' : '' // Style for disabled state
      }`}
    />
  </div>
);

export default BookingDetail;