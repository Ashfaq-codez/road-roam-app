// // user-frontend/src/main.tsx

// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App.tsx';
// import './index.css'; // <-- CRITICAL: This line must be here

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
  
// );

// user-frontend/src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
// 1. Import the router tools
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

// 2. Import your pages
import App from './App.tsx'; // Your Homepage
import DestinationsPage from './DestinationsPage.tsx'; // Your New Page
import './index.css';

// 3. Define your routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // The homepage
  },
  {
    path: "/destinations",
    element: <DestinationsPage />, // The "View More" page
  },
]);

// 4. Tell React to use the router
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)