// user-frontend/src/global.d.ts (Finalized Map Declarations)

declare global {
  interface Window {
    google: typeof google;
  }
  
}

// CRITICAL FIX: Explicitly define all missing Google Maps classes and types

declare namespace google {
  namespace maps {
    // Core Classes
    class Map {
      constructor(mapDiv: HTMLElement, options?: any);
      setCenter(latLng: LatLng | LatLngLiteral): void;
      getCenter(): LatLng;
    }
    
    class Marker {
      constructor(options?: any);
      // Loosened type for event listeners
      addListener(eventName: string, handler: (event: any) => void): void; 
      setPosition(latLng: LatLng | LatLngLiteral): void;
      setMap(map: Map | null): void;
    }

    class Geocoder {
      geocode(request: GeocoderRequest, callback: (results: GeocoderResult[] | null, status: GeocoderStatus) => void): void;
    }
    
    // Core Types
    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }
    
    // Geocoder Result Types (CRITICAL FIX)
    interface GeocoderResult {
      formatted_address: string;
      // FIX: Add the geometry property
      geometry: {
          location: LatLng; // The LatLng object containing lat() and lng()
          viewport: LatLngBounds;
      };
    }
    
    // Other Necessary Types
    interface GeocoderRequest {
      location?: LatLng | LatLngLiteral;
      address?: string;
    }
    
    enum GeocoderStatus {
      OK = "OK",
      INVALID_REQUEST = "INVALID_REQUEST",
      ZERO_RESULTS = "ZERO_RESULTS",
    }
    
    interface LatLngLiteral {
      lat: number;
      lng: number;
    }
    
    class LatLngBounds {
      constructor(sw?: LatLng | LatLngLiteral, ne?: LatLng | LatLngLiteral);
    }
    
    interface MapMouseEvent {
      latLng: LatLng;
    }

    // Places Namespace
    namespace places {
      class Autocomplete {
        constructor(inputField: HTMLInputElement, options: any);
        addListener(eventName: string, handler: (this: Autocomplete) => void): void;
        getPlace(): any;
      }
    }
  }
}