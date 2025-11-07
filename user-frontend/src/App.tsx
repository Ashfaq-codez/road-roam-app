// user-frontend/src/App.tsx

import React, { useState } from 'react';

// --- CRITICAL FIX: DEFINE THE API_ROOT ---
// This reads the variable from your Cloudflare Pages environment
// Fallback to local proxy path for 'bun run dev'
const API_ROOT = import.meta.env.VITE_API_ROOT || ''; 

// --- 1. INTERFACES (Remain the same) ---
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

// --- Main Component ---
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
      
      // --- CRITICAL FIX: Use the absolute API_ROOT URL ---
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

  // --- JSX (Polished) ---
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
        <div className="w-full max-w-2xl mx-auto p-10 bg-white border border-gray-200 rounded-xl shadow-2xl">
            <h1 className="text-4xl font-extrabold mb-8 text-center text-indigo-700">
                🚗 Road Roam Rental Booking
            </h1>
            
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
                <h2 className="text-xl font-semibold border-b pb-2 mb-4 text-gray-800">Your Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Full Name *" type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
                    <InputField label="Email *" type="email" name="email" value={formData.email} onChange={handleChange} required />
                    <InputField label="Phone Number" type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                    <InputField label="Aadhar Number (Optional)" type="text" name="aadharNumber" value={formData.aadharNumber} onChange={handleChange} />
                </div>
                
                <h2 className="text-xl font-semibold border-b pb-2 mb-4 pt-4 text-gray-800">Rental Details</h2>
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
                  className={`w-full py-3 px-4 rounded-lg shadow-lg text-xl font-bold text-white transition duration-150 ease-in-out ${
                    buttonDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300'}`
                  }
                >
                  {status === 'loading' ? 'Submitting...' : 'Book Now'}
                </button>
            </form>
        </div>
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