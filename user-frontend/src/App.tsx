// user-frontend/src/App.tsx (Polished with Hero Section)

import React, { useState } from 'react';

// --- (Interfaces and consts remain the same) ---
interface BookingRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  aadharNumber?: string; 
  rentalServiceName: string; 
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
}

const rentalServices = [
  "Airport Pickup", "In-City Rental", "Outstation Rental",
  "Corporate Rentals", "Event Rentals"
];

const initialFormState: BookingRequest = {
  fullName: '', email: '', phoneNumber: '', aadharNumber: '',
  rentalServiceName: rentalServices[0], 
  pickupDate: '', returnDate: '', pickupLocation: '',
};

const API_ROOT = import.meta.env.VITE_API_ROOT || ''; 
// --- (End of setup) ---


function BookingForm() {
  const [formData, setFormData] = useState<BookingRequest>(initialFormState);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      if (!formData.fullName || !formData.email || !formData.pickupDate) {
        setStatus('error');
        setMessage("❌ Please fill out all required fields.");
        return; 
      }
      
      const response = await fetch(`${API_ROOT}/api/bookings`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData), 
      });

      if (response.ok) { 
        setStatus('success');
        setMessage('✅ Your booking request was successfully submitted! An admin will contact you shortly.');
        setFormData(initialFormState);
      } else {
        const errorData = await response.json(); 
        throw new Error(errorData.message || 'Booking submission failed on the server.');
      }
      
    } catch (error) {
      setStatus('error');
      setMessage(`❌ Submission Error: ${error instanceof Error ? error.message : 'Unknown network error.'}`);
    }
  };
  
  const buttonDisabled = status === 'loading';

  return (
    // POLISH: Main layout wrapper
    <div className="min-h-screen bg-gray-100">
      
      {/* --- 1. HEADER --- */}
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-3xl font-extrabold text-indigo-700">
            🚗 Road Roam
          </div>
          <a 
            href="#booking-form" 
            className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Book Now
          </a>
        </nav>
      </header>

      {/* --- 2. HERO SECTION --- */}
      <div 
        className="relative h-96 bg-cover bg-center" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517524008697-84bbe3c3afd9?q=80&w=2070')" }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            Reliable Rentals for Your Next Journey
          </h1>
          <p className="text-xl md:text-2xl font-light">
            Book your car in 3 simple steps.
          </p>
        </div>
      </div>

      {/* --- 3. BOOKING FORM (Your existing code, now styled) --- */}
      <div 
        id="booking-form" // This is the anchor link for the "Book Now" button
        className="w-full max-w-4xl mx-auto p-8 md:p-12 bg-white rounded-xl shadow-2xl -mt-20 relative z-20"
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Reserve Your Vehicle
        </h2>
        
        {/* Status Message Display */}
        {status !== 'idle' && message && (
            <div className={`p-4 mb-6 rounded-lg font-medium border ${
                status === 'success' 
                    ? 'bg-green-100 text-green-700 border-green-400' 
                    : 'bg-red-100 text-red-700 border-red-400'
            }`}>
                {message}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-xl font-semibold border-b pb-2 mb-4 text-gray-800">Your Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Full Name *" type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
                <InputField label="Email *" type="email" name="email" value={formData.email} onChange={handleChange} required />
                <InputField label="Phone Number" type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                <InputField label="Aadhar Number" type="text" name="aadharNumber" value={formData.aadharNumber} onChange={handleChange} />
            </div>
            
            <h3 className="text-xl font-semibold border-b pb-2 mb-4 pt-4 text-gray-800">Rental Details</h3>
            <div>
              <label htmlFor="rentalServiceName" className="block text-sm font-medium text-gray-700 mb-1">Rental Service *</label>
              <select
                id="rentalServiceName"
                name="rentalServiceName"
                value={formData.rentalServiceName}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              >
                {rentalServices.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <InputField label="Pick-up Date *" type="date" name="pickupDate" value={formData.pickupDate} onChange={handleChange} required />
              <InputField label="Return Date *" type="date" name="returnDate" value={formData.returnDate} onChange={handleChange} required />
            </div>
            <InputField label="Pick-up Location" type="text" name="pickupLocation" value={formData.pickupLocation} onChange={handleChange} />

            <button
              type="submit"
              disabled={buttonDisabled}
              className={`w-full py-4 px-4 rounded-lg shadow-lg text-xl font-bold text-white transition duration-300 ease-in-out transform hover:scale-105 ${
                buttonDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300'}`
              }
            >
              {status === 'loading' ? 'Submitting Reservation...' : 'Submit Reservation'}
            </button>
        </form>
      </div>
      
      {/* --- 4. FOOTER --- */}
      <footer className="text-center py-8 text-gray-500 mt-12">
        © 2025 Road Roam. All rights reserved.
      </footer>
    </div>
  );
}

// --- InputField Helper Component ---
interface InputFieldProps {
  label: string;
  type: string;
  name: keyof BookingRequest;
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ label, type, name, value, onChange, required }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      id={name}
      type={type}
      name={name}
      value={value || ''}
      onChange={onChange}
      required={required}
      className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
    />
  </div>
);

export default BookingForm;