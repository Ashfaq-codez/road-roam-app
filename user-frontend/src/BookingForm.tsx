// user-frontend/src/BookingForm.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";

/* ============ Types & Constants ============ */
interface BookingRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  aadharNumber?: string;
  rentalServiceName: string;
  carModel: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;       // Combined: "Place Name — Full Address" or just "Full Address"
  pickupLat: number;
  pickupLng: number;
  passengers: number;
}

const rentalServices = [
  "Airport Transfers", "City Cruise", "Tours & Trips",
  "Corporate Rental", "Event Rental"
];
const carModels = ["Hycross", "Crysta", "Innova", "Ertiga", "Ciaz", "Dzire"];

const initialFormState: BookingRequest = {
  fullName: '',
  email: '',
  phoneNumber: '',
  aadharNumber: '',
  rentalServiceName: rentalServices[0],
  carModel: carModels[0],
  pickupDate: '',
  returnDate: '',
  pickupLocation: '',
  passengers: 1,
  // defaults: Bangalore city center
  pickupLat: 12.9716,
  pickupLng: 77.5946,
};

const API_ROOT = import.meta.env.VITE_API_ROOT || '';
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

/* make TS aware of window.google (runtime only) */
declare global {
  interface Window { google: any; }
}

/* ============ Utilities ============ */
/** Load Google Maps script once and resolve when available */
function loadGoogleMaps(apiKey: string, libraries = ['places']): Promise<typeof window.google> {
  return new Promise((resolve, reject) => {
    if (!apiKey) {
      reject(new Error('Google Maps API key not provided in VITE_GOOGLE_MAPS_API_KEY.'));
      return;
    }
    if (window.google && window.google.maps && window.google.maps.places) {
      resolve(window.google);
      return;
    }
    const id = 'google-maps-script';
    const existing = document.getElementById(id) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve(window.google));
      existing.addEventListener('error', () => reject(new Error('Failed loading Google Maps script')));
      return;
    }
    const script = document.createElement('script');
    script.id = id;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${libraries.join(',')}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google) resolve(window.google);
      else reject(new Error('Google maps script loaded but window.google not available'));
    };
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });
}

/* Simple debounce util */
function debounce(fn: (...args: any[]) => void, wait = 250) {
  let t: number | null = null;
  return (...args: any[]) => {
    if (t) window.clearTimeout(t);
    // @ts-ignore
    t = window.setTimeout(() => fn(...args), wait);
  };
}

/* Small in-memory LRU-ish cache */
class SimpleCache<K, V> {
  map = new Map<K, V>();
  max = 50;
  get(k: K) { return this.map.get(k); }
  set(k: K, v: V) {
    if (this.map.has(k)) this.map.delete(k);
    this.map.set(k, v);
    if (this.map.size > this.max) {
      const firstKey = this.map.keys().next().value!;
      this.map.delete(firstKey);
    }
  }
}

/* ============ Helper Components ============ */
const RequiredAsterisk = (required?: boolean) => required ? (<span className="text-red-600 ml-1">*</span>) : null;

const DateInput: React.FC<{ label: string; name: keyof BookingRequest; value: string; onChange: (date: Date | null, name: string) => void; required?: boolean; minDateProp?: Date }> = ({ label, name, value, onChange, required, minDateProp }) => {
  const selectedDate = value ? new Date(value.replace(/-/g, '/')) : null;
  return (
    <div>
      <label htmlFor={String(name)} className="block text-sm font-medium text-gray-700 mb-1">
        {label}{RequiredAsterisk(required)}
      </label>
      <DatePicker
        selected={selectedDate}
        onChange={(date: Date | null) => onChange(date, String(name))}
        dateFormat="dd/MM/yyyy"
        required={required}
        minDate={minDateProp || new Date()}
        placeholderText="DD/MM/YYYY"
        showTimeSelect={false}
        className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 transition duration-150"
        id={String(name)}
      />
    </div>
  );
};

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
      <label htmlFor={String(name)} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {RequiredAsterisk(required)}
      </label>
      <input
        id={String(name)}
        type={type}
        name={String(name)}
        value={value || ''}
        onChange={onChange}
        required={required}
        className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 transition duration-150"
      />
    </div>
  );
};

/* ============ LocationMapPicker (single combined pickupLocation) ============ */
interface LocationPickerProps {
  label: string;
  name: 'pickupLocation';
  value: string; // combined display string
  lat: number;
  lng: number;
  // onChange returns combined string, lat, lng
  onChange: (value: string, lat: number, lng: number) => void;
}

const LocationMapPicker: React.FC<LocationPickerProps> = ({ label, name, value, lat, lng, onChange }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  const [inputValue, setInputValue] = useState(value || '');
  const [predictions, setPredictions] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [showList, setShowList] = useState(false);
  const [loadingMaps, setLoadingMaps] = useState(true);
  const [mapsError, setMapsError] = useState<string | null>(null);

  const googleRef = useRef<any>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const autocompleteServiceRef = useRef<any | null>(null);
  const placesServiceRef = useRef<any | null>(null);
  const geocoderRef = useRef<any | null>(null);

  const predictionsCache = useRef(new SimpleCache<string, any[]>());

  // Debounced prediction fetcher
  const debouncedFetch = useRef(debounce((input: string) => {
    if (!autocompleteServiceRef.current) return;
    const cached = predictionsCache.current.get(input);
    if (cached) {
      setPredictions(cached);
      setShowList(true);
      setActiveIndex(-1);
      return;
    }
    autocompleteServiceRef.current.getPlacePredictions({
      input,
      componentRestrictions: { country: 'in' },
    }, (preds: any, status: any) => {
      if (status === googleRef.current.maps.places.PlacesServiceStatus.OK && preds && preds.length) {
        predictionsCache.current.set(input, preds);
        setPredictions(preds);
        setShowList(true);
        setActiveIndex(-1);
      } else {
        setPredictions([]);
        setShowList(false);
        setActiveIndex(-1);
      }
    });
  }, 250)).current;

  // Helpers: getPlaceDetails and geocodeAddress
  const getPlaceDetails = (placeId: string): Promise<any | null> => {
    return new Promise((resolve) => {
      if (!placesServiceRef.current) return resolve(null);

      // Request explicit fields so `name` is present
      placesServiceRef.current.getDetails(
        { placeId, fields: ['name', 'formatted_address', 'geometry'] },
        (place: any, status: any) => {
          if (status === googleRef.current.maps.places.PlacesServiceStatus.OK && place) resolve(place);
          else resolve(null);
        }
      );
    });
  };

  const geocodeAddress = (address: string): Promise<{ lat: number; lng: number; formatted_address?: string } | null> => {
    return new Promise((resolve) => {
      if (!geocoderRef.current) return resolve(null);
      geocoderRef.current.geocode({ address }, (results: any, status: any) => {
        if (status === 'OK' && results && results[0] && results[0].geometry && results[0].geometry.location) {
          const loc = results[0].geometry.location;
          resolve({ lat: loc.lat(), lng: loc.lng(), formatted_address: results[0].formatted_address });
        } else resolve(null);
      });
    });
  };

  // Initialize Google Maps (once)
  useEffect(() => {
    let mounted = true;
    setLoadingMaps(true);
    setMapsError(null);
    loadGoogleMaps(GOOGLE_API_KEY).then((g) => {
      if (!mounted) return;
      googleRef.current = g;
      const google = g as any;
      if (mapRef.current) {
        const initialLatLng = new google.maps.LatLng(lat, lng);
        const map = new google.maps.Map(mapRef.current, {
          center: initialLatLng,
          zoom: 14,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });
        mapInstanceRef.current = map;

        const marker = new google.maps.Marker({ position: initialLatLng, map, draggable: true });
        markerRef.current = marker;

        // marker dragend -> reverse geocode (no place name guaranteed)
        marker.addListener('dragend', (ev: any) => {
          const newLat = ev.latLng.lat();
          const newLng = ev.latLng.lng();
          if (!geocoderRef.current) return;
          geocoderRef.current.geocode({ location: { lat: newLat, lng: newLng } }, (results: any, status: any) => {
            if (status === 'OK' && results && results[0]) {
              const newAddress = results[0].formatted_address;
              setInputValue(newAddress);
              onChange(newAddress, newLat, newLng); // store address only when dragged
            } else {
              onChange(inputValue, newLat, newLng);
            }
          });
        });

        // services
        autocompleteServiceRef.current = new google.maps.places.AutocompleteService();
        placesServiceRef.current = new google.maps.places.PlacesService(map);
        geocoderRef.current = new google.maps.Geocoder();
      }
      setLoadingMaps(false);
    }).catch((err) => {
      setMapsError(String(err.message || err));
      setLoadingMaps(false);
      console.error('Google Maps load error', err);
    });

    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Move marker/map when external lat/lng change (e.g., form reset)
  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current) return;
    const pos = new google.maps.LatLng(lat, lng);
    mapInstanceRef.current.setCenter(pos);
    markerRef.current.setPosition(pos);
  }, [lat, lng]);

  // Keep inputValue synced when parent changed value externally
  useEffect(() => setInputValue(value || ''), [value]);

  // Trigger predictions when input value changes
  useEffect(() => {
    if (!inputValue || inputValue.trim().length === 0) {
      setPredictions([]);
      setShowList(false);
      setActiveIndex(-1);
      return;
    }
    if (!autocompleteServiceRef.current) return;
    debouncedFetch(inputValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  // Keyboard handling
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showList) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(predictions.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(-1, i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && predictions[activeIndex]) {
        selectPrediction(predictions[activeIndex]);
      } else if (predictions.length === 1) {
        selectPrediction(predictions[0]);
      }
    } else if (e.key === 'Escape') {
      setShowList(false);
      setActiveIndex(-1);
    }
  };

  // select prediction (returns combined display string to parent)
  const selectPrediction = async (prediction: any) => {
    try {
      if (!placesServiceRef.current || !mapInstanceRef.current || !markerRef.current) {
        const geo = await geocodeAddress(prediction.description || prediction.structured_formatting.main_text);
        if (geo && mapInstanceRef.current && markerRef.current) {
          const latLng = new googleRef.current.maps.LatLng(geo.lat, geo.lng);
          mapInstanceRef.current.setCenter(latLng);
          markerRef.current.setPosition(latLng);
          const address = geo.formatted_address || prediction.description || '';
          const placeName = prediction.structured_formatting?.main_text;
          const display = placeName ? `${placeName} — ${address}` : address;
          setInputValue(display);
          setShowList(false);
          setPredictions([]);
          onChange(display, geo.lat, geo.lng); // combined string stored in pickupLocation
        }
        return;
      }

      const place = await getPlaceDetails(prediction.place_id);

      if (place && place.geometry && place.geometry.location) {
        const loc = place.geometry.location;
        const newLat = loc.lat();
        const newLng = loc.lng();
        const formatted = place.formatted_address || prediction.description || '';
        const name = place.name || prediction.structured_formatting?.main_text;
        const display = name ? `${name} — ${formatted}` : formatted;

        mapInstanceRef.current.setCenter(loc);
        markerRef.current.setPosition(loc);

        setInputValue(display);
        setShowList(false);
        setPredictions([]);
        setActiveIndex(-1);

        // pass combined display string as pickupLocation
        onChange(display, newLat, newLng);
        return;
      }

      // fallback: geocode by text
      const fallback = await geocodeAddress(prediction.description || prediction.structured_formatting.main_text);
      if (fallback && mapInstanceRef.current && markerRef.current) {
        const latLng = new googleRef.current.maps.LatLng(fallback.lat, fallback.lng);
        mapInstanceRef.current.setCenter(latLng);
        markerRef.current.setPosition(latLng);
        const address = fallback.formatted_address || prediction.description || '';
        const placeName = prediction.structured_formatting?.main_text;
        const display = placeName ? `${placeName} — ${address}` : address;
        setInputValue(display);
        setShowList(false);
        setPredictions([]);
        setActiveIndex(-1);
        onChange(display, fallback.lat, fallback.lng);
        return;
      }

      // final fallback: set raw description
      const basicName = prediction.structured_formatting?.main_text;
      const display = prediction.description || basicName || '';
      setInputValue(display);
      setShowList(false);
      setPredictions([]);
      setActiveIndex(-1);
      onChange(display, lat, lng);
    } catch (err) {
      console.error('selectPrediction error', err);
      const display = prediction.description || prediction.structured_formatting?.main_text || '';
      setInputValue(display);
      setShowList(false);
      setPredictions([]);
      setActiveIndex(-1);
      onChange(display, lat, lng);
    }
  };

  // click outside to hide suggestions
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (inputRef.current && inputRef.current.contains(target)) return;
      if (listRef.current && listRef.current.contains(target)) return;
      setShowList(false);
      setActiveIndex(-1);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}{RequiredAsterisk(true)}
      </label>

      <div className="relative">
        <input
          ref={inputRef}
          id={name}
          name={name}
          type="text"
          autoComplete="off"
          placeholder={ loadingMaps ? "Loading map..." : (mapsError ? "Map failed to load" : "Search pickup location, e.g., MG Road, Bangalore") }
          value={inputValue}
          onChange={(e) => { setInputValue(e.target.value); }}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (predictions.length > 0) setShowList(true); }}
          aria-controls="places-listbox"
          aria-activedescendant={activeIndex >= 0 ? `pred-${activeIndex}` : undefined}
          aria-expanded={showList}
          className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 transition duration-150"
          disabled={!!mapsError}
        />

        {/* Suggestion dropdown */}
        {showList && predictions.length > 0 && (
          <ul
            id="places-listbox"
            ref={listRef}
            role="listbox"
            className="absolute z-50 mt-1 w-full max-h-64 overflow-auto bg-white border border-gray-200 rounded-md shadow-lg"
          >
            {predictions.map((pred: any, idx: number) => (
              <li
                id={`pred-${idx}`}
                key={pred.place_id}
                role="option"
                aria-selected={activeIndex === idx}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(-1)}
                onMouseDown={(e) => { e.preventDefault(); selectPrediction(pred); }}
                className={`px-3 py-2 cursor-pointer text-sm ${activeIndex === idx ? 'bg-gray-100' : 'bg-white'}`}
              >
                <div className="truncate">
                  <span className="font-medium">{pred.structured_formatting.main_text}</span>
                  <span className="text-gray-500"> {pred.structured_formatting.secondary_text ? ` — ${pred.structured_formatting.secondary_text}` : ''}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Map container */}
      <div className="w-full mt-3 rounded-md overflow-hidden border" style={{ height: 300 }}>
        {mapsError ? (
          <div className="h-full w-full flex items-center justify-center text-sm text-red-600 p-4">
            {mapsError}
          </div>
        ) : (
          <div ref={mapRef} className="h-full w-full" />
        )}
      </div>
    </div>
  );
};

/* ============ Main Booking Form Component ============ */
export default function BookingForm() {
  const [formData, setFormData] = useState<BookingRequest>(initialFormState);
  const [status, setStatus] =  useState<'idle' | 'loading'>('idle');
  const [modalInfo, setModalInfo] = useState<{ title: string, message: string, type: 'success' | 'error' } | null>(null);

  // Handler for standard text/select inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (modalInfo) setModalInfo(null);
    const val = e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: val }));
  };

  // Handler for date picker changes
  const handleDateChange = (date: Date | null, name: string) => {
    if (modalInfo) setModalInfo(null);
    const formattedDate = date ? format(date, 'yyyy-MM-dd') : '';
    setFormData((prev) => ({ ...prev, [name]: formattedDate }));
  };

  // Map change handler (combined display string)
  const handleMapChange = (displayAddress: string, newLat: number, newLng: number) => {
    if (modalInfo) setModalInfo(null);
    setFormData((prev) => ({
      ...prev,
      pickupLocation: displayAddress,
      pickupLat: newLat,
      pickupLng: newLng,
    }));
  };

  // Submit handler
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
        pickupLocation: formData.pickupLocation, // combined string
        rentalServiceName: formData.rentalServiceName,
        pickupLat: formData.pickupLat,
        pickupLng: formData.pickupLng,
        passengers: formData.passengers,
      };
      const response = await fetch(`${API_ROOT}/api/bookings`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setModalInfo({ title: "Booking Submitted!", message: "Your booking request was successfully submitted! Our Team will contact you shortly.", type: 'success' });
        setFormData(initialFormState);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Booking submission failed on the server.');
      }
    } catch (error) {
      setModalInfo({ title: "Input Validation Error", message: error instanceof Error ? error.message : 'Unknown network error.', type: 'error' });
    } finally {
      setStatus('idle');
    }
  };

  const buttonDisabled = status === 'loading';
  const pickupDateObject = formData.pickupDate ? new Date(formData.pickupDate.replace(/-/g, '/')) : new Date();

  return (
    <>
      {/* Modal */}
      {modalInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/30 backdrop-blur-sm" onClick={() => setModalInfo(null)}>
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className={`text-2xl font-bold mb-4 ${modalInfo.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{modalInfo.title}</h2>
            <p className="text-gray-700 mb-6">{modalInfo.message}</p>
            <button onClick={() => setModalInfo(null)} className={`w-full py-3 rounded-lg text-white font-bold ${modalInfo.type === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>OK</button>
          </div>
        </div>
      )}

      {/* Booking Form */}
      <div id="booking-form" className="w-full max-w-4xl mx-auto p-8 md:p-12 bg-white rounded-xl shadow-2xl relative z-20">
        <h2 className="text-[40px] font-bold mb-8 text-center text-gray-900">Book Your <span className='text-red-600'>Vehicle</span></h2>
        
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
            <div>
              <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-1">Number of Passengers <span className="text-red-600">*</span></label>
              <input
                id="passengers"
                name="passengers"
                type="number"
                min={1}
                max={7}
                value={formData.passengers}
                onChange={(e) => {
                  const numValue = parseInt(e.target.value as string, 10);
                  if (!isNaN(numValue) && numValue >= 1 && numValue <= 7) {
                    setFormData(prev => ({ ...prev, passengers: numValue }));
                  } else if (e.target.value === '') {
                    setFormData(prev => ({ ...prev, passengers: 0 }));
                  }
                }}
                required
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 transition duration-150"
              />
            </div>

            <div>
              <label htmlFor="rentalServiceName" className="block text-sm font-medium text-gray-700 mb-1">Rental Service<span className='text-red-600'>*</span></label>
              <select id="rentalServiceName" name="rentalServiceName" value={formData.rentalServiceName} onChange={handleChange} required className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 transition duration-150">
                {rentalServices.map(service => <option key={service} value={service}>{service}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="carModel" className="block text-sm font-medium text-gray-700 mb-1">Car Model<span className='text-red-600'>*</span></label>
            <select id="carModel" name="carModel" value={formData.carModel} onChange={handleChange} required className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 transition duration-150">
              {carModels.map(model => <option key={model} value={model}>{model}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DateInput label="Pick-up Date " name="pickupDate" value={formData.pickupDate} onChange={handleDateChange} required minDateProp={new Date()} />
            <DateInput label="Return Date " name="returnDate" value={formData.returnDate} onChange={handleDateChange} required minDateProp={pickupDateObject} />
          </div>

          {/* New: Google-like Search Map Picker (stores combined "Name — Address" in pickupLocation) */}
          <LocationMapPicker
            label="Pick-up Location (Search or drag pin)"
            name="pickupLocation"
            value={formData.pickupLocation}
            lat={formData.pickupLat}
            lng={formData.pickupLng}
            onChange={handleMapChange}
          />

          <button type="submit" disabled={buttonDisabled} className={`w-full py-4 px-4 rounded-lg shadow-lg text-xl font-bold text-white transition duration-300 ease-in-out transform hover:scale-105 ${buttonDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300'}`}>
            {status === 'loading' ? 'Submitting Reservation...' : 'Submit Reservation'}
          </button>
        </form>
      </div>
    </>
  );
}
