// user-frontend/src/BookingForm.tsx
// Includes professional modal, DatePicker, and Location Map Picker.

import { useState, useRef, useEffect } from 'react'; // <-- useRef and useEffect are essential for Maps
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";

// --- INTERFACES AND CONSTANTS ---
interface BookingRequest {
  fullName: string; email: string; phoneNumber: string; aadharNumber?: string; 
  rentalServiceName: string; carModel: string; pickupDate: string;
  returnDate: string; pickupLocation: string; 
  // CRITICAL: New fields for the Map Picker
  pickupLat: number; 
  pickupLng: number;
  passengers: number;
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
  pickupDate: '', returnDate: '', pickupLocation: '', passengers: 1,
  
  // DEFAULT COORDINATES: Bangalore City Center
  pickupLat: 12.9716, 
  pickupLng: 77.5946, 
};

const API_ROOT = import.meta.env.VITE_API_ROOT || ''; 
// --- (End of setup) ---


// --- Helper Component 1: Date Input (Remains the same) ---
const DateInput: React.FC<{ label: string; name: keyof BookingRequest; value: string; onChange: (date: Date | null, name: string) => void; required?: boolean; minDateProp?: Date }> = ({ label, name, value, onChange, required, minDateProp }) => {
    const selectedDate = value ? new Date(value.replace(/-/g, '/')) : null;
    return (
      <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}{RequiredAsterisk(required)}</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date: Date | null) => onChange(date, name)}
          dateFormat="dd/MM/yyyy"
          required={required}
          // CRITICAL FIX: Use the passed minDateProp or default to today
          minDate={minDateProp || new Date()} 
          placeholderText="DD/MM/YYYY"
          showTimeSelect={false}
          className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 transition duration-150"
          id={name}
        />
      </div>
    );
  };

// --- Helper Component 2: Location Map Picker (NEW) ---
interface LocationPickerProps {
  label: string;
  name: 'pickupLocation';
  value: string;
  lat: number;
  lng: number;
  // CRITICAL: onChange handler now returns address, lat, and lng
  onChange: (value: string, lat: number, lng: number) => void;
}
const LocationMapPicker: React.FC<LocationPickerProps> = ({ label, name, value, lat, lng, onChange }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [address, setAddress] = useState(value);
  
  // NEW REFS: Store Map and Marker instances for search functionality
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerInstanceRef = useRef<google.maps.Marker | null>(null);
  
  // 1. NEW: Function to handle text input and move the map pin
  const geocodeAddress = (addressToSearch: string) => {
      if (!window.google) {
          alert("Maps API not loaded.");
          return;
      }
      
      const geocoder = new window.google.maps.Geocoder();
      
      // Simplest possible options to allow a broad search within India
      const requestOptions = {
          address: addressToSearch,
          componentRestrictions: { country: 'in' } 
          // We intentionally REMOVE the 'bounds' object here to broaden the search
      };

      geocoder.geocode(requestOptions, (results, status) => {
          if (status === 'OK' && results && results.length > 0) {
              const newLatLng = results[0].geometry.location;
              const newAddress = results[0].formatted_address;

              // Update Map and Marker position
              if (mapInstanceRef.current && markerInstanceRef.current) {
                  mapInstanceRef.current.setCenter(newLatLng);
                  markerInstanceRef.current.setPosition(newLatLng);
                  
                  // Update the local component state and the parent form state
                  setAddress(newAddress);
                  onChange(newAddress, newLatLng.lat(), newLatLng.lng());
              }
          } else {
              // CRITICAL: Throw a clear user-friendly error
              alert('Address search failed: Could not find location for "' + addressToSearch + '". Please try a more specific address.'); 
          }
      });
  };

  useEffect(() => {
    if (window.google && mapRef.current) {
      
      const initialLatLng = { lat: lat, lng: lng };

      // Initialize the Map
      const map = new window.google.maps.Map(mapRef.current, {
        center: initialLatLng, zoom: 14, mapTypeControl: false, streetViewControl: false, fullscreenControl: false,
      });
      mapInstanceRef.current = map; // Store instance

      // Initialize the Draggable Marker
      const marker = new window.google.maps.Marker({
        position: initialLatLng, map: map, draggable: true,
      });
      markerInstanceRef.current = marker; // Store instance
      
      const geocoder = new window.google.maps.Geocoder();

      // Listener for Pin Drag
      marker.addListener('dragend', (event: google.maps.MapMouseEvent) => {
        const newLat = event.latLng.lat();
        const newLng = event.latLng.lng();

        // Reverse Geocode: Convert coordinates back to a readable address
        geocoder.geocode({ location: { lat: newLat, lng: newLng } }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const newAddress = results[0].formatted_address;
            setAddress(newAddress);
            onChange(newAddress, newLat, newLng); 
          }
        });
      });
    }
  }, [lat, lng, onChange]);

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {RequiredAsterisk(true)}
      </label>
      
      {/* NEW: Text Input Field for Search */}
      <div className="flex mb-3 space-x-2">
          <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)} // Update local display state
              onKeyDown={(e) => { // Trigger search on Enter key
                  if (e.key === 'Enter') {
                      e.preventDefault();
                      geocodeAddress(address); // Call the search function
                  }
              }}
              placeholder="Type your address to search..."
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 transition duration-150"
          />
          <button
              type="button"
              onClick={() => geocodeAddress(address)} // Call the search function
              className="mt-1 px-4 py-2 bg-gray-700 text-white rounded-lg shadow-sm hover:bg-gray-800 transition"
          >
              Search
          </button>
      </div>

      {/* Existing: Display the currently selected address */}
      <div className="p-3 bg-gray-50 border rounded-t-lg text-sm text-gray-700 font-medium">
        Selected: <span className="font-semibold text-gray-900">{address || "Drop a pin near Bangalore"}</span>
      </div>
      
      {/* Map Container */}
      <div 
        ref={mapRef} 
        className="w-full" 
        style={{ height: '300px' }} 
      />
    </div>
  );
};

const RequiredAsterisk = (required?: boolean) => {
    // Only return the red asterisk if the 'required' prop is true
    return required ? (
        <span className="text-red-600 ml-1">*</span>
    ) : null;
};
// Main Component
export default function BookingForm() {
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

  // --- CRITICAL NEW HANDLER: For Map Pin Drop ---
  const handleMapChange = (address: string, newLat: number, newLng: number) => {
    if (modalInfo) setModalInfo(null); 
    setFormData((prev) => ({
      ...prev,
      pickupLocation: address, // Update the text address
      pickupLat: newLat,      // Update the Latitude
      pickupLng: newLng,      // Update the Longitude
    }));
  };
  
  // Updated Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setModalInfo(null); 

    try {
      if (!formData.fullName || !formData.email || !formData.pickupDate || !formData.carModel || !formData.pickupLocation) {
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
        pickupLat: formData.pickupLat, // <-- CRITICAL: Include Lat/Lng
        pickupLng: formData.pickupLng, // <-- CRITICAL: Include Lat/Lng
        passengers: formData.passengers,
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
          title: "Input Validation Error", 
          message: error instanceof Error ? error.message : 'Unknown network error.',
          type: 'error'
      });
    } finally {
        setStatus('idle');
    }
  };
  const buttonDisabled = status === 'loading';

  const pickupDateObject = formData.pickupDate ? new Date(formData.pickupDate.replace(/-/g, '/')) : new Date();


  return (
    <>
      {/* --- THE MODAL COMPONENT (Remains the same) --- */}
      {modalInfo && (
        <div 
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
                <InputField label="Full Name " type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
                <InputField label="Email " type="email" name="email" value={formData.email} onChange={handleChange} required />
                <InputField label="Phone Number " type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required/>
                <InputField label="Aadhar Number" type="text" name="aadharNumber" value={formData.aadharNumber} onChange={handleChange} />
            </div>
            
            <h3 className="text-xl font-semibold border-b pb-2 mb-4 pt-4 text-gray-800">Rental Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField 
        label="Number of Passengers " 
        type="number" 
        name="passengers" 
        value={formData.passengers} 
        required 
        // CRITICAL FIX: Explicitly convert the string input to an integer on change
        onChange={(e) => {
            const numValue = parseInt(e.target.value, 10);
            
            // Check if conversion was successful and value is within limits
            if (!isNaN(numValue) && numValue >= 1 && numValue <= 7) {
                setFormData({ ...formData, [e.target.name]: numValue });
            }
            // If the input is empty or invalid (e.g., "e"), set to empty string, which the required attribute will catch
            else if (e.target.value === '') {
                 setFormData({ ...formData, [e.target.name]: 0 }); // Set to 0 so required validation can catch it if not selected.
            }
        }}
    />
            <div>
              <label htmlFor="rentalServiceName" className="block text-sm font-medium text-gray-700 mb-1">Rental Service<span className='text-red-600'>*</span> </label>
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
            </div>

            <div>
              <label htmlFor="carModel" className="block text-sm font-medium text-gray-700 mb-1">Car Model<span className='text-red-600'>*</span></label>
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
                label="Pick-up Date " 
                name="pickupDate" 
                value={formData.pickupDate} 
                onChange={handleDateChange} 
                required 
                minDateProp={new Date()}
              />
              <DateInput 
                label="Return Date " 
                name="returnDate" 
                value={formData.returnDate} 
                onChange={handleDateChange} 
                required 
                minDateProp={pickupDateObject}
              />
            </div>
            
            {/* --- CRITICAL FIX: USE MAP PICKER HERE --- */}
            <LocationMapPicker 
              label="Pick-up Location (Drag the Pin)" 
              name="pickupLocation" 
              value={formData.pickupLocation} 
              lat={formData.pickupLat} 
              lng={formData.pickupLng}
              onChange={handleMapChange}
            />

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
  value: string | number | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ label, type, name, value, onChange, required }) => {
  
  
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        
        {RequiredAsterisk(required)}
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
};