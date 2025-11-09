-- CREATE TABLE IF NOT EXISTS bookings (
--     -- Unique identifier for the booking
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
    
--     -- User-submitted data
--     full_name TEXT NOT NULL,
--     email TEXT NOT NULL,
--     phone_number TEXT,
--     aadhar_number TEXT NOT NULL,
--     -- MODIFIED: Stores the user's selected service name as plain text
--     rental_service_name TEXT NOT NULL, 
    
--     car_model TEXT NOT NULL,
--     -- Booking details
--     pickup_date TEXT NOT NULL, -- Stored as ISO 8601 string (e.g., '2025-12-01')
--     return_date TEXT NOT NULL,
--     pickup_location TEXT,
    
--     -- Admin management data
--     status TEXT NOT NULL DEFAULT 'PENDING',
    
--     -- Timestamps for professional auditing
--     created_at TIMESTAMP DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'now'))
-- );

-- road-roam-worker/schema.sql

CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone_number TEXT,
    aadhar_number TEXT,
    rental_service_name TEXT NOT NULL, 
    car_model TEXT NOT NULL, -- This is the missing column
    pickup_date TEXT NOT NULL,
    return_date TEXT NOT NULL,
    pickup_location TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'now'))
);