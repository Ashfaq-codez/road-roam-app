// user-frontend/src/BookingForm.tsx
// Includes professional modal with BLURRED background.

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";

// --- (Interfaces and consts remain the same) ---
interface BookingRequest {
  fullName: string; email: string; phoneNumber: string; aadharNumber?: string; 
  rentalServiceName: string; carModel: string; pickupDate: string;
  returnDate: string; pickupLocation: string;
}
const rentalServices = [
  "Airport Transfers", "City Cruise", "Tours & Trips",
  "Corporate Rental", "Event Rental"
];
const carModels = [
    "Hycross", "Crysta", "Innova", 
    "Ertiga", "Ciaz", "Dzire"  
];
const initialFormState: BookingRequest = {
  fullName: '', email: '', phoneNumber: '', aadharNumber: '',
  rentalServiceName: rentalServices[0], 
  carModel: carModels[0],
  pickupDate: '', returnDate: '', pickupLocation: '',
};
const API_ROOT = import.meta.env.VITE_API_ROOT || ''; 
// --- (End of setup) ---


// --- Helper Component: Date Input ---
// (This component remains unchanged)
const DateInput: React.FC<{ label: string; name: keyof BookingRequest; value: string; onChange: (date: Date | null, name: string) => void; required?: boolean }> = ({ label, name, value, onChange, required }) => {
    const selectedDate = value ? new Date(value.replace(/-/g, '/')) : null;
    return (
      <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date: Date | null) => onChange(date, name)}
          dateFormat="dd/MM/yyyy"
          required={required}
          minDate={new Date()}
          placeholderText="DD/MM/YYYY"
          showTimeSelect={false}
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
  const [status, setStatus] =  useState<'idle' | 'loading'>('idle'); 
  const [modalInfo, setModalInfo] = useState<{ title: string, message: string, type: 'success' | 'error' } | null>(null);

  // Handler for standard text/select inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (modalInfo) setModalInfo(null); 
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  // Handler for date picker changes
  const handleDateChange = (date: Date | null, name: string) => {
    if (modalInfo) setModalInfo(null);
    const formattedDate = date ? format(date, 'yyyy-MM-dd') : ''; 
    setFormData((prev) => ({
      ...prev,
      [name]: formattedDate,
    }));
  };
  
  // Updated Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setModalInfo(null); 

    try {
      if (!formData.fullName || !formData.email || !formData.pickupDate || !formData.carModel) {
        throw new Error("Please fill out all required fields.");
      }

      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        aadharNumber: formData.aadharNumber,
        carModel: formData.carModel,
        pickupDate: formData.pickupDate,
        returnDate: formData.returnDate,
        pickupLocation: formData.pickupLocation,
        rentalServiceName: formData.rentalServiceName,
      };
      
      const response = await fetch(`${API_ROOT}/api/bookings`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload), 
      });

      if (response.ok) { 
        setModalInfo({
            title: "Booking Submitted!",
            message: "Your booking request was successfully submitted! Our Team will contact you shortly.",
            type: 'success'
        });
        setFormData(initialFormState);
      } else {
        const errorData = await response.json(); 
        throw new Error(errorData.message || 'Booking submission failed on the server.');
      }
    } catch (error) {
      setModalInfo({
          title: "Submission Error",
          message: error instanceof Error ? error.message : 'Unknown network error.',
          type: 'error'
      });
    } finally {
        setStatus('idle');
    }
  };
  
  const buttonDisabled = status === 'loading';


  return (
    <>
      {/* --- THE MODAL COMPONENT --- */}
      {modalInfo && (
        <div 
          // --- CRITICAL FIX: Replaced black overlay with a blurred backdrop ---
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/30 backdrop-blur-sm"
          onClick={() => setModalInfo(null)} // Click background to close
        >
          <div 
            className="bg-white rounded-lg shadow-2xl p-8 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()} 
          >
            <h2 className={`text-2xl font-bold mb-4 ${
              modalInfo.type === 'success' ? 'text-green-600' : 'text-red-600'
            }`}>
              {modalInfo.title}
            </h2>
            <p className="text-gray-700 mb-6">{modalInfo.message}</p>
            <button
              onClick={() => setModalInfo(null)} // Close button
              className={`w-full py-3 rounded-lg text-white font-bold ${
                modalInfo.type === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* --- YOUR EXISTING BOOKING FORM --- */}
      <div 
        id="booking-form"
        className="w-full max-w-4xl mx-auto p-8 md:p-12 bg-white rounded-xl shadow-2xl relative z-20"
      >
        <h2 className="text-[40px] font-bold mb-8 text-center text-gray-900">
          Book Your <span className='text-red-600' >Vehicle</span>
        </h2>
        
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
    </>
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