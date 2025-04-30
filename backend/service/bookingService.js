
const express = require('express');
require('dotenv').config();
const db = require("../db");
const bcrypt = require('bcrypt');
const sendEmail = require('../Utils/SendEmail');
const app = express();

app.post("/create-booking", (req, res) => {
  const { user_id, venue_id, vendor_id, type, status, booking_dates, appointment_date } = req.body;
  const query = `
    INSERT INTO bookings (user_id, venue_id, vendor_id, type, status, booking_dates, appointment_date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [user_id, venue_id, vendor_id, type, status, JSON.stringify(booking_dates), appointment_date],
    (err, result) => {
      if (err) {
        console.error("Error creating booking:", err);
        return res.status(500).send("Failed to create booking.");
      }
      sendBookingEnqueryMail(user_id, venue_id, vendor_id, type, status, JSON.stringify(booking_dates), appointment_date);
      res.status(201).json({ message: "Booking created successfully!", bookingId: result.insertId });
    }
  );
});

// 2. Read All Bookings
app.get("/get-bookings", (req, res) => {
  const { user_id, venue_id, vendor_id } = req.headers; // Get filters from headers
  const { page = 1, limit = 10, search = "", tab = "" } = req.query; // Pagination and search parameters

  // Calculate pagination offset
  const offset = (page - 1) * limit;

  // Base query with JOINs
  let query = `
    SELECT 
      bookings.*, 
      user.name AS user_name, 
      user.email AS user_email,
      user.mobile AS user_mobile,
      venues.venue_name AS venue_name,
      venues.user_id AS venue_owner_id,
      venues.venue_phone_no AS venue_phone_no,
      vendors.vendor_name AS vendor_name,
      vendors.vendor_service AS vendor_service,
      vendors.contact_number AS contact_number
    FROM bookings
    INNER JOIN user ON bookings.user_id = user.user_id
    LEFT JOIN venues ON bookings.venue_id = venues.venue_id
    LEFT JOIN vendors ON bookings.vendor_id = vendors.service_reg_id
    WHERE 1=1
  `;

  // Add conditions based on the provided filters
  const params = [];
  if (user_id) {
    query += " AND bookings.user_id = ?";
    params.push(user_id);
  }
  if (venue_id) {
    query += " AND venues.user_id = ?";
    params.push(venue_id);
  }
  if (vendor_id) {
    query += " AND vendors.user_id = ?";
    params.push(vendor_id);
  }
  if (tab) {
    query += " AND bookings.status = ?";
    params.push(tab);
  }

  // Add search functionality
  if (search) {
    query += `
      AND (
        user.name LIKE ? OR 
        user.email LIKE ? OR 
        venues.venue_name LIKE ? OR 
        vendors.vendor_name LIKE ?
      )
    `;
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern, searchPattern, searchPattern);
  }

  // Ensure only rows with valid venue or vendor are returned
  query += " AND (bookings.venue_id IS NOT NULL OR bookings.vendor_id IS NOT NULL)";

  // Add sorting by created_at
  query += " ORDER BY bookings.created_at DESC";

  // Add pagination
  query += " LIMIT ? OFFSET ?";
  params.push(parseInt(limit, 10), offset);

  // Query to get the total count
  let countQuery = `
    SELECT COUNT(*) AS total
    FROM bookings
    INNER JOIN user ON bookings.user_id = user.user_id
    LEFT JOIN venues ON bookings.venue_id = venues.venue_id
    LEFT JOIN vendors ON bookings.vendor_id = vendors.service_reg_id
    WHERE 1=1
  `;

  // Add the same filters to the count query
  if (user_id) {
    countQuery += " AND bookings.user_id = ?";
  }
  if (venue_id) {
    countQuery += " AND venues.user_id = ?";
  }
  if (vendor_id) {
    countQuery += " AND vendors.user_id = ?";
  }
  if (tab) {
    countQuery += " AND bookings.status = ?";
  }
  if (search) {
    countQuery += `
      AND (
        user.name LIKE ? OR 
        user.email LIKE ? OR 
        venues.venue_name LIKE ? OR 
        vendors.vendor_name LIKE ?
      )
    `;
  }
  countQuery += " AND (bookings.venue_id IS NOT NULL OR bookings.vendor_id IS NOT NULL)";

  // Execute the count query first
  db.query(countQuery, params.slice(0, params.length - 2), (countErr, countResults) => {
    if (countErr) {
      console.error("Error fetching booking count:", countErr);
      return res.status(500).json({ error: "Failed to fetch booking count." });
    }

    const totalRecords = countResults[0]?.total || 0; // Get the total records
    const totalPages = Math.ceil(totalRecords / limit); // Calculate total pages

    // Execute the main query
    db.query(query, params, (err, results) => {
      if (err) {
        console.error("Error fetching bookings:", err);
        return res.status(500).json({ error: "Failed to fetch bookings." });
      }

      // Respond with results, pagination info, and total pages
      res.json({
        results,
        success: true,
        pagination: {
          currentPage: parseInt(page, 10),
          limit: parseInt(limit, 10),
          totalPages,
        },
      });
    });
  });
});




// 3. Read a Single Booking by ID
app.get("/get-booking/:id", (req, res) => {
  const { id } = req.params;

  const query = "SELECT * FROM bookings WHERE booking_id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching booking:", err);
      return res.status(500).send("Failed to fetch booking.");
    }
    if (results.length === 0) {
      return res.status(404).send("Booking not found.");
    }
    res.json(results[0]);
  });
});

// 4. Update a Booking
app.put("/update-booking/:id", (req, res) => {
  const { id } = req.params;
  const {  status, booking_dates, appointment_date } = req.body;

  const query = `
    UPDATE bookings
    SET status = ?, booking_dates = ?, appointment_date = ?
    WHERE booking_id = ?
  `;

  db.query(
    query,
    [ status, JSON.stringify(booking_dates), appointment_date, id],
    (err, result) => {
      if (err) {
        console.error("Error updating booking:", err);
        return res.status(500).send("Failed to update booking.");
      }
      if (result.affectedRows === 0) {
        return res.status(404).send("Booking not found.");
      }
      db.query("select * from bookings where booking_id = ?", [id],(err,result)=>{
        const bookingDetails = result[0];
        sendBookingEnqueryMail(bookingDetails?.user_id, bookingDetails?.venue_id, bookingDetails?.vendor_id, bookingDetails?.type, status, JSON.stringify(booking_dates), appointment_date);
      })
      res.json({ message: "Booking updated successfully!", success : true });
    }
  );
});

// 5. Delete a Booking
app.delete("/delete-booking/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM bookings WHERE booking_id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting booking:", err);
      return res.status(500).send("Failed to delete booking.");
    }
    if (result.affectedRows === 0) {
      return res.status(404).send("Booking not found.");
    }
    res.json({ message: "Booking deleted successfully!" , success: true });
  });
});

const sendBookingEnqueryMail = async (user_id, venue_id, vendor_id, type, status, booking_dates, appointment_date) => {
  let userData = null;
  let venueData = null;
  let vendorData = null;
  let mailOptions = null;
  db.query(`select * from user where user_id = ?`, [user_id], (err,result)=> {
    userData = result[0];
    if (type === "venue") {
      db.query(`select * from venues where venue_id = ?`, [venue_id], (err,result)=> {
        venueData = result[0];
        mailOptions = {
          from: 'info@wedeazzy.com',
          to: userData.email,
          subject: `🗓️ Your Visit is Scheduled – We Can’t Wait to Welcome You!`,
          text: `Dear ${userData.name},
      
      We’re excited to confirm your visit to ${type === "venue" ? "Venue" : "Service"}! Here are the details of your scheduled appointment and booking information for your convenience.
      
      Booking Details:
      Booking Date: ${booking_dates}
      Venue Name: ${venueData.venue_name}
      Location: ${venueData.venue_map_url}
      
      Appointment Details:
      Scheduled Visit Date and Time: ${appointment_date}
      
      Your booking status is : ${status}
      If you have any questions, updates, or special requests ahead of your visit, please don’t hesitate to reach out to us at wedeazzy@gmail.com or +91 99300 90487.
      
      We look forward to welcoming you and helping make your event truly special!
      
      Warm regards,
      Wedeazzy Team`, 
        };
        sendEmail(mailOptions)
      });
    } else {
      db.query(`select * from vendors where service_reg_id = ?`, [vendor_id], (err,result)=> {
        vendorData = result[0];
        mailOptions = {
          from: 'info@wedeazzy.com',
          to: userData.email,
          subject: `🗓️ Your Visit is Scheduled – We Can’t Wait to Welcome You!`,
          text: `Dear ${userData.name},
      
      We’re excited to confirm your visit to ${type === "venue" ? "Venue" : "Service"}! Here are the details of your scheduled appointment and booking information for your convenience.
      
      Booking Details:
      Booking Date: ${booking_dates}
      Venue Name: ${vendorData.vendor_name}
      Location: ${vendorData.maplink}
      Service : ${vendorData.vendor_service}
      
      Your booking status is : ${status}
      If you have any questions, updates, or special requests ahead of your visit, please don’t hesitate to reach out to us at wedeazzy@gmail.com or +91 99300 90487.
      
      We look forward to welcoming you and helping make your event truly special!
      
      Warm regards,
      Wedeazzy Team`, 
        };
        sendEmail(mailOptions)
      });
    }
  });
}
module.exports = app;
