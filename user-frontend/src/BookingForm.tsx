// user-frontend/src/BookingForm.tsx
// Includes professional integration of react-datepicker.

import { useState } from 'react';
import DatePicker from 'react-datepicker'; // <-- NEW
import { format } from 'date-fns';        // <-- NEW
import "react-datepicker/dist/react-datepicker.css"; // <-- NEW: Global DatePicker CSS

// --- INTERFACES AND CONSTANTS (Retained) ---
interface BookingRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  aadharNumber?: string; 
  rentalServiceName: string; 
  carModel: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
}

const rentalServices = [
  "Airport Pickup", "In-City Rental", "Outstation Rental",
  "Corporate Rentals", "Event Rentals", "Full-Day City Tour"
];


const carModels = [
    "Dzire", "Ciaz",
    "Ertiga", 
    "Innova", "Crysta"
];

const initialFormState: BookingRequest = {
  fullName: '', email: '', phoneNumber: '', aadharNumber: '',
  rentalServiceName: rentalServices[0], 
  carModel: carModels[0],
  pickupDate: '', returnDate: '', pickupLocation: '',
};

const API_ROOT = import.meta.env.VITE_API_ROOT || ''; 
// ---------------------------------------------


// --- Helper Component: Date Input ---
// This handles the complexity of the DatePicker library
const DateInput: React.FC<{ label: string; name: keyof BookingRequest; value: string; onChange: (date: Date | null, name: string) => void; required?: boolean }> = ({ label, name, value, onChange, required }) => {
    
    // Convert the stored ISO string (YYYY-MM-DD) back to a Date object for the DatePicker
    const selectedDate = value ? new Date(value.replace(/-/g, '/')) : null;

    return (
      <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        
        <DatePicker
          selected={selectedDate}
          // When the date changes, call the main form handler
          onChange={(date: Date | null) => onChange(date, name)}
          dateFormat="dd/MM/yyyy"
          required={required}
          minDate={new Date()} // Prevent booking in the past
          placeholderText="DD/MM/YYYY"
          showTimeSelect={false}
          
          // Apply your standard input styling
          className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 transition duration-150"
          id={name}
        />
      </div>
    );
  };
// --------------------------------------


// Main Component
export function BookingForm() {
  const [formData, setFormData] = useState<BookingRequest>(initialFormState);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Handler for standard text/select inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  // Handler for date picker changes (converts Date object to ISO string for storage)
  const handleDateChange = (date: Date | null, name: string) => {
    // We format the date to a simple ISO-like string (e.g., 2025-11-09) for submission
    const formattedDate = date ? format(date, 'yyyy-MM-dd') : ''; 
    setFormData((prev) => ({
      ...prev,
      [name]: formattedDate,
    }));
  };
  
  // Submission logic (remains the same)
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
    <div 
      id="booking-form"
      className="w-full max-w-4xl mx-auto p-8 md:p-12 bg-white rounded-xl shadow-2xl relative z-20"
    >
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
        Reserve Your Vehicle
      </h2>
      
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
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 transition duration-150"
            >
              {rentalServices.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
          </div>

          <div>
  <label htmlFor="carModel" className="block text-sm font-medium text-gray-700 mb-1">Car Model *</label>
  <select
    id="carModel"
    name="carModel"
    value={formData.carModel}
    onChange={handleChange}
    required
    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 transition duration-150"
  >
    {carModels.map(model => (
      <option key={model} value={model}>{model}</option>
    ))}
  </select>
</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* NEW: Use the reliable DateInput component */}
            <DateInput 
              label="Pick-up Date *" 
              name="pickupDate" 
              value={formData.pickupDate} 
              onChange={handleDateChange} 
              required 
            />
            <DateInput 
              label="Return Date *" 
              name="returnDate" 
              value={formData.returnDate} 
              onChange={handleDateChange} 
              required 
            />
          </div>
          <InputField label="Pick-up Location" type="text" name="pickupLocation" value={formData.pickupLocation} onChange={handleChange} />

          <button
            type="submit"
            disabled={buttonDisabled}
            className={`w-full py-4 px-4 rounded-lg shadow-lg text-xl font-bold text-white transition duration-300 ease-in-out transform hover:scale-105 ${
              buttonDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300'}`
            }
          >
            {status === 'loading' ? 'Submitting Reservation...' : 'Submit Reservation'}
          </button>
      </form>
    </div>
  );
}

// --- InputField Helper Component (For non-date fields) ---
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
      className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 transition duration-150"
    />
  </div>
);