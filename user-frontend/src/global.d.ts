// user-frontend/src/global.d.ts

// This interface teaches TypeScript that the Google Maps API exists on the window object
declare global {
  interface Window {
    google: typeof google;
  }
}

// Define the namespace structure used by the Places API
declare namespace google {
  namespace maps {
    namespace places {
      class Autocomplete {
        constructor(inputField: HTMLInputElement, options: any);
        addListener(eventName: string, handler: (this: Autocomplete) => void): void;
        getPlace(): any;
      }
    }
  }
}