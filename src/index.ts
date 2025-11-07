// src/index.ts

// 1. Human-readable definition of the expected booking data structure
// Used for POST /api/bookings
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

// Data structure returned by D1 for a full booking record
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

// Data structure expected for a status update request (now used for full update)
interface BookingUpdateData extends Partial<BookingRequest> {
    status?: BookingRecord['status']; // Optional status update
}

// 2. Define the environment variables (bindings) for perfect TypeScript clarity
interface Env {
  DB: D1Database;
  RESEND_API_KEY: string;
}

// Define CORS headers once for all successful responses
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*', // Allows requests from all your Pages domains (*.pages.dev)
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

// Define headers for simple plain text errors (e.g., 404)
const TEXT_CORS_HEADERS = {
    ...CORS_HEADERS,
    'Content-Type': 'text/plain',
};

export default {
  // The Worker's entry point for handling requests
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    
    // --- CRITICAL FIX 1: Handle OPTIONS (Pre-flight) request ---
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 204, // No Content
            headers: CORS_HEADERS, // Use CORS_HEADERS directly
        });
    }

    // --- SECURITY CHECK: Protect Admin Routes ---
    const isAdminRoute = url.pathname.startsWith('/api/admin');
    if (isAdminRoute) {
        // ... (placeholder remains) ...
    }
    
    // --- 1. POST /api/bookings: Handle new user booking submissions ---
    if (url.pathname === '/api/bookings' && request.method === 'POST') {
      try {
        const bookingData: BookingRequest = await request.json(); 

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
        
        ctx.waitUntil(sendAdminNotification(bookingData, env));

        // FIX: Added CORS_HEADERS
        return new Response(
          JSON.stringify({ id: result.meta.last_row_id, message: "Booking received." }),
          { status: 201, headers: { ...CORS_HEADERS } }
        );

      } catch (error) {
        console.error("Booking submission error:", error);
        // FIX: Added CORS_HEADERS
        return new Response(
            JSON.stringify({ 
                message: "Invalid booking data submitted. Please check all fields.", 
                status: "error"
            }), 
            { status: 400, headers: { ...CORS_HEADERS } }
        );
      }
    }

    // --- ADMIN API ROUTES (GET, PATCH, DELETE) ---
    
    // 2. GET /api/admin/bookings: List All Bookings
    if (url.pathname === '/api/admin/bookings' && request.method === 'GET') {
      try {
        const { results } = await env.DB.prepare(
          `SELECT 
             id, full_name, rental_service_name, pickup_date, 
             status, created_at 
           FROM bookings 
           ORDER BY created_at DESC`
        ).all<BookingRecord>(); 

        // FIX: Added CORS_HEADERS
        return new Response(
          JSON.stringify(results),
          { status: 200, headers: { ...CORS_HEADERS } }
        );

      } catch (error) {
        console.error("Error fetching admin bookings:", error);
        // FIX: Added TEXT_CORS_HEADERS
        return new Response("Internal Server Error fetching bookings.", { status: 500, headers: { ...TEXT_CORS_HEADERS } });
      }
    }

    // 3. Dynamic Route Handling: /api/admin/bookings/:id
    const bookingMatch = url.pathname.match(/^\/api\/admin\/bookings\/(\d+)$/);
    if (bookingMatch) {
        const bookingId = parseInt(bookingMatch[1]!);
        
        // 3a. GET /api/admin/bookings/:id: Fetch Single Booking Detail
        if (request.method === 'GET') {
            try {
                const booking = await env.DB.prepare(
                    `SELECT * FROM bookings WHERE id = ?`
                ).bind(bookingId)
                .first<BookingRecord>();

                if (!booking) {
                    return new Response('Booking Not Found', { status: 404, headers: { ...TEXT_CORS_HEADERS } });
                }

                // FIX: Added CORS_HEADERS
                return new Response(JSON.stringify(booking), { 
                    status: 200, 
                    headers: { ...CORS_HEADERS } 
                });
            } catch (error) {
                console.error(`Error fetching booking ${bookingId}:`, error);
                return new Response('Internal Server Error.', { status: 500, headers: { ...TEXT_CORS_HEADERS } });
            }
        }

        // 3b. PATCH /api/admin/bookings/:id: Update Booking Status and Details
        if (request.method === 'PATCH') {
            try {
                const updateData: BookingUpdateData = await request.json();

                const updateQuery = `
                    UPDATE bookings 
                    SET full_name = ?, email = ?, phone_number = ?, aadhar_number = ?, 
                        rental_service_name = ?, pickup_date = ?, return_date = ?, 
                        pickup_location = ?, status = ?
                    WHERE id = ?
                `;
                
                const existingBooking = await env.DB.prepare(`SELECT * FROM bookings WHERE id = ?`).bind(bookingId).first<BookingRecord>();
                
                if (!existingBooking) {
                    return new Response('Booking Not Found', { status: 404, headers: { ...TEXT_CORS_HEADERS } });
                }

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
                
                if (result.meta.rows_affected === 0) {
                     return new Response('Booking Not Found or No changes made.', { status: 404, headers: { ...TEXT_CORS_HEADERS } });
                }

                // FIX: Added CORS_HEADERS
                return new Response(
                    JSON.stringify({ message: `Booking ${bookingId} details updated.` }), 
                    { status: 200, headers: { ...CORS_HEADERS } }
                );

            } catch (error) {
                console.error(`Error updating booking ${bookingId}:`, error);
                return new Response('Invalid data or update error.', { status: 400, headers: { ...TEXT_CORS_HEADERS } });
            }
        }

        // 3c. DELETE /api/admin/bookings/:id: Permanently Delete Booking
        if (request.method === 'DELETE') {
            try {
                const result = await env.DB.prepare(
                    `DELETE FROM bookings WHERE id = ?`
                ).bind(bookingId)
                .run();
                
                if (result.meta.rows_affected === 0) {
                     return new Response('Booking Not Found', { status: 404, headers: { ...TEXT_CORS_HEADERS } });
                }

                // FIX: Added CORS_HEADERS
                return new Response(
                    JSON.stringify({ message: `Booking ${bookingId} permanently deleted.` }), 
                    { status: 200, headers: { ...CORS_HEADERS } }
                );

            } catch (error) {
                console.error(`Error deleting booking ${bookingId}:`, error);
                return new Response('Internal Server Error during deletion.', { status: 500, headers: { ...TEXT_CORS_HEADERS } });
            }
        }
    }

    // --- Default 404 response ---
    return new Response('API Route Not Found', { status: 404, headers: { ...TEXT_CORS_HEADERS } });
  },
};

// --- Separate function for cleaner, readable email logic ---
async function sendAdminNotification(bookingData: BookingRequest, env: Env) {
    // ... (logic remains the same) ...
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