const express = require('express');
require('dotenv').config();
const db = require("../db");
const app = express();
const moment = require("moment"); 

app.get('/get-cards-count', (req, res) => {
  let cardsData = {};
  // Query for the 'venues' table
  const venuesQuery = 'SELECT COUNT(*) AS count FROM venues';
  db.query(venuesQuery, (err, venueResult) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching venues', details: err });
    } else {
      cardsData.venues = venueResult[0].count;

      // Query for the 'vendors' table
      const vendorsQuery = 'SELECT COUNT(*) AS count FROM vendors';
      db.query(vendorsQuery, (err, vendorResult) => {
        if (err) {
          res.status(500).json({ error: 'Error fetching vendors', details: err });
        } else {
          cardsData.vendors = vendorResult[0].count;

          // Query for the 'user' table
          const userQuery = 'SELECT COUNT(*) AS count FROM user';
          db.query(userQuery, (err, userResult) => {
            if (err) {
              res.status(500).json({ error: 'Error fetching users', details: err });
            } else {
              cardsData.user = userResult[0].count;

              // Query for the 'services' table
              const servicesQuery = 'SELECT COUNT(*) AS count FROM services';
              db.query(servicesQuery, (err, servicesResult) => {
                if (err) {
                  res.status(500).json({ error: 'Error fetching services', details: err });
                } else {
                  cardsData.services = servicesResult[0].count;

                  // Query for the 'region' table
                  const regionQuery = 'SELECT COUNT(*) AS count FROM region';
                  db.query(regionQuery, (err, regionResult) => {
                    if (err) {
                      res.status(500).json({ error: 'Error fetching regions', details: err });
                    } else {
                      cardsData.region = regionResult[0].count;

                      // Query for the 'city' table
                      const cityQuery = 'SELECT COUNT(*) AS count FROM city';
                      db.query(cityQuery, (err, cityResult) => {
                        if (err) {
                          res.status(500).json({ error: 'Error fetching cities', details: err });
                        } else {
                          cardsData.city = cityResult[0].count;

                          // Query for the 'business_claims' table
                          const businessClaimsQuery = 'SELECT COUNT(*) AS count FROM business_claims';
                          db.query(businessClaimsQuery, (err, businessClaimsResult) => {
                            if (err) {
                              res.status(500).json({ error: 'Error fetching business claims', details: err });
                            } else {
                              cardsData.business_claims = businessClaimsResult[0].count;

                              // Send the final response
                              res.status(200).json({ success: true, results: cardsData });
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
});




app.get("/booking-status-count", async (req, res) => {
  const { type, id } = req.query; 

  try {
    let query = `
      SELECT 
        status, 
        COUNT(*) AS count 
      FROM 
        bookings
    `;

    const conditions = [];
    const params = [];

    if (type && id) {
      if (type === "venue") {
        query += `
          JOIN venues 
          ON bookings.venue_id = venues.venue_id
        `;
        conditions.push("venues.user_id = ?");
        params.push(id);
      } else if (type === "vendor") {
        query += `
          JOIN vendors 
          ON bookings.vendor_id = vendors.service_reg_id
        `;
        conditions.push("vendors.user_id = ?");
        params.push(id);
      }
      else if (type === "user") {
        query += `
          JOIN user 
          ON bookings.user_id = user.user_id
        `;
        conditions.push("user.user_id = ?");
        params.push(id);
      }
    }

    // Add WHERE and GROUP BY clauses
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }
    query += " GROUP BY status";

    // Execute the query
    db.query(query, params, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ error: "Database query failed" });
      }

      res.json(results);
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const getDateRange = (period) => {
  const today = moment();
  let startDate, endDate;

  if (period === "weekly") {
		endDate = today.add(1,"day").format('YYYY-MM-DD');
    startDate = today.subtract(1,"week").format('YYYY-MM-DD');
  } else if (period === "monthly") {
    endDate = today.add(1,"day").format('YYYY-MM-DD');
    startDate = today.subtract(30,"days").format('YYYY-MM-DD');
  }

  return { startDate, endDate };
};

app.get("/pending-chart-data", async (req, res) => {
  const { type, id, period } = req.query; // 'week' or 'month'
  if (!period || !["weekly", "monthly"].includes(period)) {
    return res.status(400).json({ error: "Invalid period. Please use 'weekly' or 'monthly'." });
  }

  try {
    const { startDate, endDate } = getDateRange(period);
    // Query to get the count of 'Pending' bookings for each day in the range
    let query = `
      SELECT
        DATE(created_at) AS day,
        COUNT(*) AS count
      FROM
        bookings
    `;
    const params = [];
    let groupBy = "DAY";
    // Add the condition for type and id (if provided)
    if (type && id) {
      if (type === "venue") {
        query += `
          JOIN venues ON bookings.venue_id = venues.venue_id
          WHERE venues.user_id = ? and
        `;
        params.push(id);
      } else if (type === "vendor") {
        query += `
          JOIN vendors ON bookings.vendor_id = vendors.service_reg_id
          WHERE vendors.user_id = ? and
        `;
        params.push(id);
      }
    } 

		if (type === "" && id === "") 
			query += ` where `;
		
    if (period === "weekly") {
      query +=  `created_at BETWEEN ? AND ?`; // this is not working
      groupBy = "day";
      params.push(startDate, endDate);
    } else if (period === "monthly") {
      query += `created_at BETWEEN ? AND ?`;
      groupBy = "day";
      params.push(startDate, endDate);
    }

    query += ` GROUP BY DATE(created_at)`;

    db.query(query, params, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ error: "Database query failed" });
      }
      const labels = [];
      const data = [];

      if (period === "weekly") {
				const weekDays = ["Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu"];

				// Calculate the date range from last Friday to today (Thursday)
				const startOfWeek = moment().subtract(7, 'days');
			
				// Loop through the last 7 days, from Friday to Thursday
				for (let i = 0; i < 7; i++) {
					const day = startOfWeek.add(1, 'days'); 
					const dayData = results.find((row) => {return day.isSame(row.day,"day")}); 
					labels.push(day.format("ddd")); // Add the corresponding label (e.g., "Fri", "Sat", ...)
					data.push(dayData ? dayData.count : 0); // Add the count or 0 if no data exists
				}
			}
			
      // If monthly, get the days of the month
      else if (period === "monthly") {
        const startOfmonth = moment().subtract(30, 'days');
        for (let i = 1; i <= 30; i++) {
          const day = startOfmonth.add(1,"days");
          const dayData = results.find((row) => {return day.isSame(row.day,"day")});
          labels.push(day.date());
          data.push(dayData ? dayData.count : 0);
        }
      }

      // Return the results as a JSON object
      res.json({
        labels,
        data,
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/bookings-today", async (req, res) => {
  const { type, id } = req.query; // Get type and id from the query parameters

  try {
    // Base query for today's bookings with user, venue, and vendor details
    let query = `
      SELECT 
        b.*,
        u.name AS user_name,
        u.email AS user_email,
        u.mobile AS user_phone,
        v.venue_name AS venue_name,
        v.venue_map_url AS venue_location,
        vd.vendor_name AS vendor_name,
        vd.vendor_service AS vendor_service_type
      FROM bookings b
      LEFT JOIN user u ON b.user_id = u.user_id
      LEFT JOIN venues v ON b.venue_id = v.venue_id
      LEFT JOIN vendors vd ON b.vendor_id = vd.service_reg_id
    `;
    const params = [];
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // Start of today
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999); // End of today

    // Add the condition for today's date
    query += `
      WHERE b.created_at >= ? AND b.created_at <= ?
    `;
    params.push(todayStart, todayEnd);

    // Add the condition for type and id if provided
    if (type && id) {
      if (type === "venue") {
        query += `
          AND b.venue_id IN (
            SELECT venue_id
            FROM venues
            WHERE user_id = ?
          )
        `;
        params.push(id);
      } else if (type === "vendor") {
        query += `
          AND b.vendor_id IN (
            SELECT service_reg_id
            FROM vendors
            WHERE user_id = ?
          )
        `;
        params.push(id);
      }
    }

    // Execute the query
    db.query(query, params, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ error: "Database query failed" });
      }
      res.json(results);
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = app;