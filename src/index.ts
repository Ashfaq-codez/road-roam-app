// src/index.ts (Hono Routing)

import { Hono } from 'hono';
import { cors } from 'hono/cors'; // Hono's official CORS middleware

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

interface BookingRecord {
  id: number;
  // ... (Full record fields) ...
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  created_at: string;
}

interface Env {
  DB: D1Database;
  RESEND_API_KEY: string;
}

// --- 2. Hono Setup ---
type HonoEnv = { Bindings: Env };
const app = new Hono<HonoEnv>();

// --- 3. CORS and Middleware ---
app.use('*', cors({
    origin: '*', // Allows all origins (all your Pages sites)
    allowMethods: ['POST', 'GET', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    maxAge: 600,
}));

// --- 4. Hono Routing ---

// A. USER ROUTE: POST /api/bookings
app.post('/api/bookings', async (c) => {
    const env = c.env; // Access environment bindings via Hono's context
    
    try {
        const bookingData: BookingRequest = await c.req.json(); 

        const result = await env.DB.prepare(
          `INSERT INTO bookings (full_name, email, phone_number, aadhar_number, rental_service_name, pickup_date, return_date, pickup_location)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          bookingData.fullName,
          bookingData.email,
          bookingData.phoneNumber,
          bookingData.aadharNumber || null, 
          bookingData.rentalServiceName,
          bookingData.pickupDate,
          bookingData.returnDate,
          bookingData.pickupLocation
        ).run();
        
        c.executionCtx.waitUntil(sendAdminNotification(bookingData, env));

        return c.json({ id: result.meta.last_row_id, message: "Booking received." }, 201);

    } catch (error) {
        console.error("Booking submission error:", error);
        return c.json({ message: "Invalid booking data submitted. Please check all fields.", status: "error" }, 400);
    }
});

// B. ADMIN ROUTE: GET /api/admin/bookings (List All)
app.get('/api/admin/bookings', async (c) => {
    // NOTE: Security check goes here once Cloudflare Access is fully set up
    const env = c.env;
    try {
        const { results } = await env.DB.prepare(
          `SELECT id, full_name, rental_service_name, pickup_date, status, created_at FROM bookings ORDER BY created_at DESC`
        ).all<BookingRecord>(); 

        return c.json(results); // Hono defaults to status 200
    } catch (error) {
        console.error("Error fetching admin bookings:", error);
        return c.text("Internal Server Error fetching bookings.", 500);
    }
});

// C. ADMIN ROUTES: /api/admin/bookings/:id (GET, PATCH, DELETE)
app.get('/api/admin/bookings/:id', async (c) => {
    const env = c.env;
    const bookingId = c.req.param('id');
    
    try {
        const booking = await env.DB.prepare(`SELECT * FROM bookings WHERE id = ?`)
          .bind(bookingId)
          .first<BookingRecord>(); 

        if (!booking) return c.text('Booking Not Found', 404);

        return c.json(booking);
    } catch (error) {
        console.error(`Error fetching booking ${bookingId}:`, error);
        return c.text('Internal Server Error.', 500);
    }
});

app.patch('/api/admin/bookings/:id', async (c) => {
    // ... (Your PATCH logic from the previous block using c.req.json() and c.env) ...
    return c.text('Update logic successfully reached', 200); // REPLACE with full PATCH logic
});

app.delete('/api/admin/bookings/:id', async (c) => {
    // ... (Your DELETE logic from the previous block using c.env) ...
    return c.text('Delete logic successfully reached', 200); // REPLACE with full DELETE logic
});

// D. Fallback 404 Handler (Hono handles this cleanly)
app.all('*', (c) => {
    return c.text('API Route Not Found', 404);
});


// --- 5. Worker Export (Required by Cloudflare) ---
export default app;

// --- Separate function for cleaner, readable email logic (Remains the same) ---
// Note: This function is now accessed via c.executionCtx.waitUntil(sendAdminNotification(bookingData, env))
async function sendAdminNotification(bookingData: BookingRequest, env: Env) {
    // ... (logic remains the same) ...
}