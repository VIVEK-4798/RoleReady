const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const db = require("../db");
const bcrypt = require('bcrypt');
const sendEmail = require('../Utils/SendEmail');
const getOptionMailForUserOnboarding = require('../constant/EmailConstant');
const app = express();
app.use(bodyParser.json());
const lodash = require('lodash');

// 1. Create a new user
app.post('/create-users', async (req, res) => {
    const { name, mobile, email, role, password, image } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const query = 'INSERT INTO user (name, mobile, email, role, password, image) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [name, mobile, email, role, hashedPassword, image || null], async (err, result) => {
      if (err) {
        // Check if error is due to duplicate entry 
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: 'Email or mobile number already exists' });
        }
        return res.status(500).json({ error: 'Error creating user' });
      }
      // TODO : need to make a entry in service table in role is service
      await sendEmail(getOptionMailForUserOnboarding(name,email));
      res.status(201).json({ result : 1, message: 'User created successfully' });
    });
});

// 2. Read all users

app.get('/get-users', (req, res) => {
    const { page = 1, limit = 10, search = "" } = req.query; // Get pagination and search parameters from query params

    const offset = (page - 1) * limit; // Calculate offset for pagination
    const searchCondition = !lodash.isEmpty(search)
        ? `WHERE name LIKE '%${search}%' OR email LIKE '%${search}%' OR mobile LIKE '%${search}%'`
        : ""; // Build search condition

    // Query to fetch users with pagination
    const query = `
        SELECT * 
        FROM user 
        ${searchCondition} 
        LIMIT ${limit} OFFSET ${offset};
    `;

    // Query to fetch the total count of users
    const countQuery = `
        SELECT COUNT(*) AS total 
        FROM user 
        ${searchCondition};
    `;

    // First, get the total count
    db.query(countQuery, (countErr, countResults) => {
        if (countErr) {
            console.error('Error fetching total users count:', countErr);
            return res.status(500).json({ error: countErr.message });
        }

        const totalRecords = countResults[0]?.total || 0; // Get total records
        const totalPages = Math.ceil(totalRecords / limit); // Calculate total pages

        // Then, execute the main query
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching users:', err);
                return res.status(500).json({ error: err.message });
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


// 3. Read a single user by ID
app.get('/get-users/:id', (req, res) => {
  const sql = `SELECT * FROM user WHERE user_id = ?`;
  const values = [req.params.id];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).send('Error fetching user.');
    }
    if (result.length === 0) {
      return res.status(404).send('User not found.');
    }
    res.status(200).json(result[0]);
  });
});

// 4. Update a user
app.put('/update-users/:id', async (req, res) => {
  const { name, mobile, email, currentPassword, newPassword, image, role } = req.body;
  const { id } = req.params;

  try {
    db.query("SELECT * FROM user WHERE user_id = ?", id, async (err, user) => {
      if (err || user.length === 0) {
        return res.status(404).send({ message: 'User not found.' });
      }

      if (currentPassword) {
        const isPasswordValid = await bcrypt.compare(currentPassword, user[0].password);
        if (!isPasswordValid) {
          return res.status(400).send({ message: 'Current password did not match with old password.' });
        }
      }

      let sql = `
        UPDATE user 
        SET name = ?, mobile = ?, email = ?, image = ?
      `;
      const values = [name, mobile, email, image || null];

      if (newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        sql += `, password = ?`;
        values.push(hashedPassword);
      }

      sql += ` WHERE user_id = ?`;
      values.push(id);

      db.query(sql, values, (err, result) => {
        if (err) {
          console.error('Error updating user:', err);
          return res.status(500).send({ message: 'Error updating user.' });
        }

        if (result.affectedRows === 0) {
          return res.status(404).send({ message: 'User not found.' });
        }

        res.status(200).send({ success: true, msg: 'User updated successfully.' });
      });
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).send({ message: 'An unexpected error occurred.' });
  }
});


// 5. Delete a user
app.delete('/delete-users/:id', (req, res) => {
  const sql = `DELETE FROM user WHERE user_id = ?`;
  const values = [req.params.id];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).send('Error deleting user.');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('User not found.');
    }
    res.status(200).send('User deleted successfully.');
  });
});

app.get('/get-role-users/role/:role', (req, res) => {
    const { role } = req.params;
    const sql = `SELECT * FROM user WHERE role = ?`;

    db.query(sql, [role], (err, results) => {
      if (err) {
        console.error('Error fetching users by role:', err);
        return res.status(500).send('Error fetching users by role.');
      }
      if (results.length === 0) {
        return res.status(404).send(`No users found with the role: ${role}`);
      }
      res.status(200).json(results);
    });
});

app.get('/search-users', (req, res) => {
  const { page = 1, limit = 10, search = '', role=[] } = req.query;

  const offset = (page - 1) * limit;
  const sql = `
    SELECT * FROM user 
    WHERE (name LIKE ? OR email LIKE ?) AND role IN ('admin','venue-user')
    LIMIT ? OFFSET ?
  `;
  const searchTerm = `%${search}%`;

  db.query(sql, [searchTerm, searchTerm, parseInt(limit), parseInt(offset)], (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).send('Error fetching users.');
    }

    // Fetch total count for pagination metadata
    const countSql = `
      SELECT COUNT(*) AS total FROM user 
      WHERE name LIKE ? OR email LIKE ?
    `;
    db.query(countSql, [searchTerm, searchTerm], (countErr, countResults) => {
      if (countErr) {
        console.error('Error fetching total count:', countErr);
        return res.status(500).send('Error fetching users.');
      }

      const total = countResults[0].total;
      const totalPages = Math.ceil(total / limit);

      res.status(200).json({
        totalItems: total,
        totalPages,
        currentPage: parseInt(page),
        data: results,
        success: true
      });
    });
  });
});

module.exports = app;