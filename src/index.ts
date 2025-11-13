// src/index.tsx (Using Hono Router - FINAL ROUTE ORDER)

import { Hono } from 'hono';
import { cors } from 'hono/cors'; 
// import { Resend } from 'resend';

// --- 1. INTERFACES (Must be kept) ---
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
  pickupLat: number; 
  pickupLng: number;
  passengers: number;
}

interface BookingRecord {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  aadhar_number: string | null;
  rental_service_name: string;
  car_model: string;
  pickup_date: string;
  return_date: string;
  pickup_location: string;
  pickup_lat: number; // Default Latitude
  pickup_lng: number; // Default Longitude
  passengers: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  created_at: string;
}

interface BookingUpdateData extends Partial<BookingRequest> {
    status?: BookingRecord['status'];
}

interface Env {
  DB: D1Database;
  RESEND_API_KEY: string;
}

// --- 2. Hono Setup ---
type HonoEnv = { Bindings: Env };
const app = new Hono<HonoEnv>();

// --- 3. CORS Middleware (Must be first) ---
app.use('*', cors({
    origin: '*', 
    allowMethods: ['POST', 'GET', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    maxAge: 600,
}));

// --- 4. Hono Routing (Specific routes MUST come first) ---

// Handler for the base path
app.get('/', (c) => {
    return c.text('Road Roam API is running.', 200);
});

// A. USER ROUTE: POST /api/bookings (Booking Submission)
app.post('/api/bookings', async (c) => {
    const env = c.env; 
    try {
        const bookingData: BookingRequest = await c.req.json(); 
        // CRITICAL FIX: Run Server-Side Validation before DB insertion
        validateBookingData(bookingData);
        const result = await env.DB.prepare(
          `INSERT INTO bookings (full_name, email, phone_number, aadhar_number, rental_service_name, car_model, pickup_date, return_date, pickup_location, pickup_lat, pickup_lng, passengers)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` // Total 11 placeholders now!
    ).bind(
          bookingData.fullName,
          bookingData.email,
          bookingData.phoneNumber,
          bookingData.aadharNumber || null, 
          bookingData.rentalServiceName,
          bookingData.carModel, // <-- NEW BINDING
          bookingData.pickupDate,
          bookingData.returnDate,
          bookingData.pickupLocation,
          bookingData.pickupLat, // <-- NEW BINDING
          bookingData.pickupLng,  // <-- NEW BINDING
          bookingData.passengers
        ).run();
        
        c.executionCtx.waitUntil(sendAdminNotification(bookingData, env));
        return c.json({ id: result.meta.last_row_id, message: "Booking received." }, 201);
    } catch (error) {
        // FIX: Ensure error.message is safely returned in the 400 response
        console.error("Validation failed:", error); 
        return c.json({ 
            message: error instanceof Error ? error.message : "Invalid submission data.", 
            status: "error" 
        }, 400);
    }
});

// B. ADMIN ROUTE: GET /api/admin/bookings (List All)
app.get('/api/admin/bookings', async (c) => {
    const env = c.env;
    try {
        const { results } = await env.DB.prepare(
          `SELECT id, full_name, rental_service_name, car_model, pickup_date, status, created_at FROM bookings ORDER BY created_at DESC`
        ).all<BookingRecord>(); 
        return c.json(results); 
    } catch (error) {
        console.error("Error fetching admin bookings:", error);
        return c.text("Internal Server Error fetching bookings.", 500); 
    }
});

// NEW: ADMIN ROUTE: GET /api/admin/export (Export CSV)
app.get('/api/admin/export', async (c) => {
    const env = c.env;
    try {
        // 1. Fetch all booking records
        const { results } = await env.DB.prepare(
            `SELECT * FROM bookings ORDER BY created_at DESC`
        ).all<BookingRecord>(); 

        if (!results || results.length === 0) {
            return c.text("No bookings to export.", 404);
        }

        // 2. Convert JSON results to CSV string
        // Get the column headers (keys of the first object)
        const headers = Object.keys(results[0]!).join(',');

        // Map over results to create rows
        const csvRows = results.map(row => {
            // Ensure all values are quoted and separated by commas
            return Object.values(row).map(value => {
                // Handle null and ensure values are treated as strings
                const safeValue = value === null ? '' : String(value).replace(/"/g, '""');
                // Wrap value in quotes to handle commas within the data (e.g., location addresses)
                return `"${safeValue}"`;
            }).join(',');
        });

        // 3. Combine headers and rows
        const csv = [headers, ...csvRows].join('\n');

        // 4. Return as a downloadable file
        return new Response(csv, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                // This header forces the browser to download the file
                'Content-Disposition': `attachment; filename="roadroam_bookings_${new Date().toISOString().split('T')[0]}.csv"`,
            },
        });

    } catch (error) {
        console.error("Error generating CSV export:", error);
        return c.text("Internal Server Error during export.", 500);
    }
});

// C. ADMIN ROUTES: Dynamic GET, PATCH, DELETE
app.get('/api/admin/bookings/:id', async (c) => {
    const env = c.env; const bookingId = c.req.param('id');
    try {
        const booking = await env.DB.prepare(`SELECT * FROM bookings WHERE id = ?`).bind(bookingId).first<BookingRecord>(); 
        if (!booking) return c.text('Booking Not Found', 404);
        return c.json(booking);
    } catch (error) { console.error(`Error fetching booking ${bookingId}:`, error); return c.text('Internal Server Error.', 500); }
});



app.patch('/api/admin/bookings/:id', async (c) => {
    const env = c.env; 
    const bookingId = parseInt(c.req.param('id')!);
    
    try {
        const updateData: BookingUpdateData = await c.req.json();
        const existingBooking = await env.DB.prepare(`SELECT * FROM bookings WHERE id = ?`).bind(bookingId).first<BookingRecord>();
        
        if (!existingBooking) return c.text('Booking Not Found', 404);

        // --- EMAIL LOGIC ---
        // Check if the status is being changed from PENDING to CONFIRMED
        const statusChangedToConfirmed = 
            existingBooking.status === 'PENDING' && 
            updateData.status === 'CONFIRMED';

        const statusChangedToCancelled = 
            existingBooking.status !== 'CANCELLED' && 
            updateData.status === 'CANCELLED';
        
        
        // ---

        const updateQuery = `
            UPDATE bookings 
            SET full_name = ?, email = ?, phone_number = ?, aadhar_number = ?, 
                rental_service_name = ?, car_model = ?, pickup_date = ?, return_date = ?, 
                pickup_location = ?, pickup_lat = ?, pickup_lng = ?, passengers = ?, status = ?
            WHERE id = ?
        `;
        
        const result = await env.DB.prepare(updateQuery).bind(
            updateData.fullName ?? existingBooking.full_name, 
            updateData.email ?? existingBooking.email,
            updateData.phoneNumber ?? existingBooking.phone_number, 
            updateData.aadharNumber ?? existingBooking.aadhar_number, 
            updateData.rentalServiceName ?? existingBooking.rental_service_name,
            updateData.carModel ?? existingBooking.car_model, 
            updateData.pickupDate ?? existingBooking.pickup_date,
            updateData.returnDate ?? existingBooking.return_date,
            updateData.pickupLocation ?? existingBooking.pickup_location,
            updateData.pickupLat ?? existingBooking.pickup_lat, // New Lat
            updateData.pickupLng ?? existingBooking.pickup_lng, // New Lng
            updateData.passengers ?? existingBooking.passengers, // Passengers
            updateData.status ?? existingBooking.status, 
            bookingId
        ).run();
        
        if (result.meta.rows_affected === 0) return c.text('No changes made.', 200);

        // --- EMAIL LOGIC ---
        
        if (statusChangedToConfirmed) {
            const confirmedBooking = { ...existingBooking, ...updateData };
            // We 'await' this so if it fails, the catch block runs
            await sendUserConfirmation(confirmedBooking, env);
            // c.executionCtx.waitUntil(sendUserConfirmation(confirmedBooking, env));
        }
        else if (statusChangedToCancelled) {
            const cancelledBooking = { ...existingBooking, ...updateData };
            // We 'await' this so if it fails, the catch block runs
            await sendUserCancellation(cancelledBooking, env);
            // c.executionCtx.waitUntil(sendUserCancellation(cancelledBooking, env));
        }
        // ---

        return c.json({ message: `Booking ${bookingId} details updated.` }, 200);

    } catch (error) { 
        console.error(`Error updating booking ${bookingId}:`, error); 
        return c.text('Invalid data or update error.', 400); 
    }
});

app.delete('/api/admin/bookings/:id', async (c) => {
    const env = c.env; const bookingId = c.req.param('id');
    try {
        const result = await env.DB.prepare(`DELETE FROM bookings WHERE id = ?`).bind(bookingId).run();
        if (result.meta.rows_affected === 0) return c.text('Booking Not Found', 404);
        return c.json({ message: `Booking ${bookingId} permanently deleted.` }, 200);
    } catch (error) { console.error(`Error deleting booking ${bookingId}:`, error); return c.text('Internal Server Error during deletion.', 500); }
});

// D. Fallback 404 Handler (MUST BE LAST)
app.all('*', (c) => {
    console.log(`TRACER LOG: 404 Not Found for ${c.req.method} ${c.req.path}`);
    return c.text('API Route Not Found', 404);
});


// --- 5. Worker Export (Using the most standard export) ---
export default app;

// --- Separate function for cleaner, readable email logic ---
async function sendAdminNotification(bookingData: BookingRequest, env: Env) {
  const subject = `NEW ROAD ROAM BOOKING: ${bookingData.rentalServiceName}`;
  const body = `<h1>New Booking Received!</h1>
    <p>Service: <strong>${bookingData.rentalServiceName}</strong></p>
    <p>Name: ${bookingData.fullName}</p>
    <p>Email: ${bookingData.email}</p>
    <p>Phone: ${bookingData.phoneNumber}</p>
    <p>Dates: ${bookingData.pickupDate} to ${bookingData.returnDate}</p>
    <p>Location: ${bookingData.pickupLocation}</p>
    ${bookingData.aadharNumber ? `<p>Aadhar: ${bookingData.aadharNumber}</p>` : ''}`;

  // defensive checks
  if (!env.RESEND_API_KEY) {
    console.error('sendAdminNotification: RESEND_API_KEY is not configured.');
    return;
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Road Roam <onboarding@resend.dev>',
        to: ['roadroamcarrentals@gmail.com'], // test address
        subject,
        html: body,
      }),
    });

    const text = await res.text();
    if (!res.ok) {
      console.error(`Resend API returned ${res.status}: ${text}`);
    } else {
      // log the response id lightly (don't print secret)
      console.log('Resend API success:', res.status, text.slice(0, 300));
    }
  } catch (err) {
    console.error('sendAdminNotification: fetch error', err);
  }
}

// --- NEW HELPER: Validation Function ---
function validateBookingData(data: BookingRequest): boolean {
    // Helper to check if a string is composed purely of digits
    const isNumeric = (str: string) => /^\d+$/.test(str);

    // 1. Full Name (String length check: 2 to 25 characters)
    if (data.fullName.length > 25 || data.fullName.length < 3) {
        throw new Error("Name must be between 3 and 25 characters.");
    }

    // 2. Phone Number (Exactly 10 digits and numeric)
    if (!data.phoneNumber || data.phoneNumber.length !== 10 || !isNumeric(data.phoneNumber)) {
        throw new Error("Phone number must be exactly 10 digits.");
    }

    // 3. Aadhar Number (Optional, but if present, exactly 12 digits and numeric)
    if (data.aadharNumber && data.aadharNumber.length > 0) {
        if (data.aadharNumber.length !== 12 || !isNumeric(data.aadharNumber)) {
            throw new Error("Aadhar number must be exactly 12 digits.");
        }
    }
    if (typeof data.passengers !== 'number' || data.passengers < 1 || data.passengers > 7) {
        throw new Error("Passenger count must be a valid number between 1 and 7.");
    }
    
    // Note: Email format validation is usually handled by the browser/API itself.

    return true; // Validation passed
}


// --- EMAIL FUNCTION 2: Notify User (NEW, uses your robust pattern) ---
async function sendUserConfirmation(bookingData: BookingRecord, env: Env) {
    const subject = `Your Road Roam Booking is Confirmed! (ID: ${bookingData.id})`;
    const body = `<h1>Your Booking is Confirmed!</h1>
    <p>Hello ${bookingData.full_name},</p>
    <p>We are happy to confirm your booking for the <strong>${bookingData.rental_service_name}</strong> (${bookingData.car_model}).</p>
    <p>Your driver will meet you on ${bookingData.pickup_date} at ${bookingData.pickup_location}.</D>
    <p>Thank you for choosing Road Roam!</p>`;

    if (!env.RESEND_API_KEY) {
        console.error('sendUserConfirmation: RESEND_API_KEY is not configured.');
        throw new Error("Email API key is not set up.");
    }

    try {
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${env.RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'Road Roam <support@roadroam.in>',
                to: [bookingData.email], // <-- Sends to the CUSTOMER's email
                subject,
                html: body,
            }),
        });

        const text = await res.text();
        if (!res.ok) {
            console.error(`sendUserConfirmation: Resend API returned ${res.status}: ${text}`);
            throw new Error(`Failed to send confirmation email: ${text}`);
        } else {
            console.log('sendUserConfirmation: Resend API success:', res.status);
        }
    } catch (err) {
        console.error('sendUserConfirmation: fetch error', err);
        throw err;
    }
}

// --- EMAIL FUNCTION 3: Notify User (NEW, uses your robust pattern) ---
async function sendUserCancellation(bookingData: BookingRecord, env: Env) {
    const subject = `Your Road Roam Booking is Cancelled! (ID: ${bookingData.id})`;
    const body = `<h1>Your Booking is Cancelled!</h1>
    <p>Hello ${bookingData.full_name},</p>
    <p>We are sorry to see you go.</p>
    <p>Thank you. Hope to see you again</p>`;

    if (!env.RESEND_API_KEY) {
        console.error('sendUserCancellation: RESEND_API_KEY is not configured.');
        throw new Error("Email API key is not set up.");
    }

    try {
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${env.RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'Road Roam <support@roadroam.in>',
                to: [bookingData.email], // <-- Sends to the CUSTOMER's email
                subject,
                html: body,
            }),
        });

        const text = await res.text();
        if (!res.ok) {
            console.error(`sendUserCancellation: Resend API returned ${res.status}: ${text}`);
            throw new Error(`Failed to send confirmation email: ${text}`);
        } else {
            console.log('sendUserCancellation: Resend API success:', res.status);
        }
    } catch (err) {
        console.error('sendUserCancellation: fetch error', err);
        throw err;
    }
}