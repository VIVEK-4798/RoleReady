const express = require('express');
require('dotenv').config();
const db = require("../db");
const sendEmail = require('../Utils/SendEmail');
const multer = require('multer');
const path = require('path');

const app = express.Router();

// Storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/resumes/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

// Safe parse helper
const safeParseInt = (value) => {
  if (!value || isNaN(parseInt(value))) return null;
  return parseInt(value);
};

app.post("/create-booking", upload.single('resume'), (req, res) => {
  const {
    user_id,
    venue_id,
    service_reg_id, // <--- renamed
    type,
    status,
    booking_dates,
    appointment_date,
    name,
    phone
  } = req.body;

  const parsedUserId = safeParseInt(user_id);
  const parsedVenueId = safeParseInt(venue_id);
  const parsedServiceRegId = safeParseInt(service_reg_id); // <--- new name
  const parsedBookingDates = Array.isArray(booking_dates)
    ? booking_dates
    : JSON.parse(booking_dates || "[]");

  const resume_file = req.file ? `/uploads/resumes/${req.file.filename}` : null;

  const query = `
    INSERT INTO bookings
    (user_id, venue_id, vendor_id, type, status, booking_dates, appointment_date, applicant_name, applicant_phone, resume_file)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      parsedUserId,
      parsedVenueId,
      parsedServiceRegId, // still inserting into vendor_id column
      type,
      status,
      JSON.stringify(parsedBookingDates),
      appointment_date,
      name,
      phone,
      resume_file
    ],
    (err, result) => {
      if (err) {
        console.error("Error creating booking:", err);
        return res.status(500).send("Failed to create booking.");
      }

      sendEmail(parsedUserId, parsedVenueId, parsedServiceRegId, type, status, parsedBookingDates, appointment_date);
      res.status(201).json({ message: "Booking created successfully!", bookingId: result.insertId });
    }
  );
});


// 2. Read All Bookings
app.get("/get-bookings", (req, res) => {
  const { user_id, venue_id, vendor_id } = req.headers;
  const { page = 1, limit = 10, search = "", tab = "" } = req.query;

  const offset = (page - 1) * limit;
  const params = [];

  let query = `
    SELECT 
      bookings.booking_id,
      bookings.user_id,
      bookings.venue_id,
      bookings.vendor_id,
      bookings.type,
      bookings.status,
      bookings.booking_dates,
      bookings.appointment_date,
      bookings.created_at,
      bookings.updated_at,
      bookings.applicant_name,
      bookings.applicant_phone,
      bookings.resume_file,

      venues.venue_name,
      venues.venue_address,

      vendors.vendor_name,
      vendors.vendor_address

    FROM bookings
    LEFT JOIN venues ON bookings.venue_id IS NOT NULL AND bookings.venue_id = venues.venue_id
    LEFT JOIN vendors ON bookings.vendor_id IS NOT NULL AND bookings.vendor_id = vendors.service_reg_id
    WHERE 1 = 1
  `;

  // Filters
  if (user_id) {
    query += " AND bookings.user_id = ?";
    params.push(user_id);
  }
  if (venue_id) {
    query += " AND bookings.venue_id = ?";
    params.push(venue_id);
  }
  if (vendor_id) {
    query += " AND bookings.vendor_id = ?";
    params.push(vendor_id);
  }
  if (tab) {
    query += " AND bookings.status = ?";
    params.push(tab);
  }
  if (search) {
    const pat = `%${search}%`;
    query += `
      AND (
        bookings.applicant_name LIKE ? OR
        bookings.applicant_phone LIKE ?
      )
    `;
    params.push(pat, pat);
  }

  query += " ORDER BY bookings.created_at DESC LIMIT ? OFFSET ?";
  params.push(parseInt(limit, 10), offset);

  // Count query (same filters, no joins)
  let countQuery = `SELECT COUNT(*) AS total FROM bookings WHERE 1=1`;
  const countParams = [];

  if (user_id) {
    countQuery += " AND user_id = ?";
    countParams.push(user_id);
  }
  if (venue_id) {
    countQuery += " AND venue_id = ?";
    countParams.push(venue_id);
  }
  if (vendor_id) {
    countQuery += " AND vendor_id = ?";
    countParams.push(vendor_id);
  }
  if (tab) {
    countQuery += " AND status = ?";
    countParams.push(tab);
  }
  if (search) {
    const pat = `%${search}%`;
    countQuery += `
      AND (
        applicant_name LIKE ? OR
        applicant_phone LIKE ?
      )
    `;
    countParams.push(pat, pat);
  }

  // Execute count first
  db.query(countQuery, countParams, (countErr, countRes) => {
    if (countErr) {
      console.error("Error counting bookings:", countErr);
      return res.status(500).json({ error: "Failed to count bookings." });
    }

    const totalRecords = countRes[0]?.total || 0;
    const totalPages = Math.ceil(totalRecords / limit);

    db.query(query, params, (err, results) => {
      if (err) {
        console.error("Error fetching bookings:", err);
        return res.status(500).json({ error: "Failed to fetch bookings." });
      }

      res.json({
        success: true,
        results,
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
