// src/index.tsx (Using Hono Router - FINAL STABLE VERSION)

import { Hono } from 'hono';
import { cors } from 'hono/cors'; 

// --- 1. INTERFACES (Must be kept) ---
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
  full_name: string;
  email: string;
  phone_number: string;
  aadhar_number: string | null;
  rental_service_name: string;
  pickup_date: string;
  return_date: string;
  pickup_location: string;
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

// --- 3. CORS Middleware (Fixes all CORS errors) ---
app.use('*', cors({
    origin: '*', 
    allowMethods: ['POST', 'GET', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    maxAge: 600,
}));

// --- 4. Hono Routing ---

// Handler for the base path: https://road-roam-api.ashrahman777.workers.dev/
app.get('/', (c) => {
    return c.text('Road Roam API is running.', 200);
});


// A. USER ROUTE: POST /api/bookings (Booking Submission)
app.post('/api/bookings', async (c) => {
    const env = c.env; 
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

        return c.json(results); 
    } catch (error) {
        console.error("Error fetching admin bookings:", error);
        // Note: This error is often a D1 binding issue if the code is correct
        return c.text("Internal Server Error fetching bookings.", 500); 
    }
});

// C. ADMIN ROUTES: Dynamic GET, PATCH, DELETE
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
    const env = c.env;
    const bookingId = parseInt(c.req.param('id')!);

    try {
        const updateData: BookingUpdateData = await c.req.json();
        
        const existingBooking = await env.DB.prepare(`SELECT * FROM bookings WHERE id = ?`).bind(bookingId).first<BookingRecord>();
        if (!existingBooking) return c.text('Booking Not Found', 404);

        const updateQuery = `
            UPDATE bookings 
            SET full_name = ?, email = ?, phone_number = ?, aadhar_number = ?, 
                rental_service_name = ?, pickup_date = ?, return_date = ?, 
                pickup_location = ?, status = ?
            WHERE id = ?
        `;
        
        const result = await env.DB.prepare(updateQuery).bind(
            updateData.fullName ?? existingBooking.full_name,
            updateData.email ?? existingBooking.email,
            updateData.phoneNumber ?? existingBooking.phone_number,
            updateData.aadharNumber ?? existingBooking.aadhar_number, 
            updateData.rentalServiceName ?? existingBooking.rental_service_name,
            updateData.pickupDate ?? existingBooking.pickup_date,
            updateData.returnDate ?? existingBooking.return_date,
            updateData.pickupLocation ?? existingBooking.pickup_location,
            updateData.status ?? existingBooking.status, 
            bookingId 
        ).run();
        
        if (result.meta.rows_affected === 0) return c.text('No changes made.', 200);

        return c.json({ message: `Booking ${bookingId} details updated.` }, 200);

    } catch (error) {
        console.error(`Error updating booking ${bookingId}:`, error);
        return c.text('Invalid data or update error.', 400);
    }
});

app.delete('/api/admin/bookings/:id', async (c) => {
    const env = c.env;
    const bookingId = c.req.param('id');
    
    try {
        const result = await env.DB.prepare(
            `DELETE FROM bookings WHERE id = ?`
        ).bind(bookingId)
        .run();
        
        if (result.meta.rows_affected === 0) return c.text('Booking Not Found', 404);

        return c.json({ message: `Booking ${bookingId} permanently deleted.` }, 200);

    } catch (error) {
        console.error(`Error deleting booking ${bookingId}:`, error);
        return c.text('Internal Server Error during deletion.', 500);
    }
});


// D. Fallback 404 Handler (Hono handles this cleanly)
app.all('*', (c) => {
    return c.text('API Route Not Found', 404);
});


// --- 5. Worker Export (Required by Cloudflare) ---
// FIX: Export Hono's fetch handler explicitly for maximum stability
// export default {
//     fetch: app.fetch,
// };
// --- 5. Worker Export (Required by Cloudflare) ---
// REVERT to the standard Hono export. This should fix the 405 error.
export default app;
// --- Separate function for cleaner, readable email logic (Remains the same) ---
async function sendAdminNotification(bookingData: BookingRequest, env: Env) {
    const subject = `NEW ROAD ROAM BOOKING: ${bookingData.rentalServiceName}`;
    const body = `
      <h1>New Booking Received!</h1>
      <p>Service: <strong>${bookingData.rentalServiceName}</strong></p>
      <p>Name: ${bookingData.fullName}</p>
      <p>Email: ${bookingData.email}</p>
      <p>Phone: ${bookingData.phoneNumber}</p>
      <p>Dates: ${bookingData.pickupDate} to ${bookingData.returnDate}</p>
      <p>Location: ${bookingData.pickupLocation}</p>
      ${bookingData.aadharNumber ? `<p>Aadhar: ${bookingData.aadharNumber}</p>` : ''}
    `;
    
    await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${env.RESEND_API_KEY}`, 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from: 'bookings@road-roam.com',
            to: 'admin@road-roam.com', 
            subject: subject,
            html: body,
        }),
    });
}