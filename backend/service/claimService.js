const express = require('express');
require('dotenv').config();
const db = require("../db");
const bcrypt = require('bcrypt');
const lodash = require('lodash');
const app = express();

app.post('/postClaim', (req, res) => {
	const { email, id, type } = req.body;
	const sql = `SELECT * FROM user WHERE email = ?`;
	db.query(sql, [email], (err, userData) => {
		if (err) {
			console.error('Error fetching users by role:', err);
			return res.status(500).send({message:'Something went wrong, Please contact support.'});
		}
		if (userData.length === 0) {
			return res.status(404).send({message: `This email is not registed with us.`});
		}

		if (!userData[0].user_id || !type ) {
			return res.status(400).send({ message: 'Missing required fields.' });
		}
	
		const serachSql = `select * from business_claims where business_id = ? and user_id = ? and business_type = ?`;
		db.query(serachSql, [id, userData[0].user_id, type], (err, results) => {
			if (err) {
				console.error('Error creating claim:', err);
				return res.status(500).send({ message: 'Something went wrong, please contact support.' });
			}
			if (results.length !== 0) {
				return res.status(400).send({message: `Your claim in already in progess`});
			}
			const sql = `INSERT INTO business_claims (business_id, business_type, user_id, claim_status) VALUES (?, ?, ?, 'Pending')`;
			db.query(sql, [id, type, userData[0].user_id], (err, results) => {
				if (err) {
					console.error('Error creating claim:', err);
					return res.status(500).send({ message: 'Something went wrong, please contact support.' });
				}
				res.status(201).json({ message: 'Claim submitted successfully.', success:true, claim_id: results.insertId });
			});
		});
	});
});

app.get('/claims', (req, res) => {
  const { page = 1, limit = 100000 } = req.query;
  const offset = (page - 1) * limit;

  const sql = `SELECT 
         c.claim_id, 
         c.claim_status, 
         u.name AS user_name, 
         u.email AS user_email,
				 u.role AS user_role,
         CASE 
           WHEN c.business_type = 'vendor' THEN v.vendor_name
           ELSE vn.venue_name
         END AS venue_or_vendor_name,
         CASE 
           WHEN c.business_type = 'vendor' THEN v.contact_number
           ELSE vn.venue_phone_no
         END AS contact_number,
         CASE 
           WHEN c.business_type = 'vendor' THEN v.email
           ELSE vn.venue_email
         END AS venue_or_vendor_email
       FROM business_claims c
       LEFT JOIN user u ON c.user_id = u.user_id
       LEFT JOIN vendors v ON c.business_type = 'vendor' AND c.business_id = v.service_reg_id
       LEFT JOIN venues vn ON c.business_type != 'vendor' AND c.business_id = vn.venue_id
       LIMIT ? OFFSET ?`;

  const countSql = `SELECT COUNT(*) AS total FROM business_claims`;

  db.query(sql, [parseInt(limit), parseInt(offset)], (err, rows) => {
    if (err) {
      console.error('Error fetching claims:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No claims found' });
    }

    db.query(countSql, (countErr, countRows) => {
      if (countErr) {
        console.error('Error fetching total claims count:', countErr);
        return res.status(500).json({ message: 'Internal server error' });
      }

      const totalClaims = countRows[0].total;

      res.status(200).json({
        total: totalClaims,
        page: parseInt(page),
        limit: parseInt(limit),
        claims: rows,
				success:true
      });
    });
  });
});

app.put('/updateClaim', (req, res) => {
	const { claim_id, claim_status } = req.body;

	// Validation
	if (!claim_id || !["Pending", "Approved", "Rejected"].includes(claim_status)) {
		return res.status(400).send({ message: 'Invalid input data.' });
	}

	const sql = `UPDATE business_claims SET claim_status = ?, updated_at = CURRENT_TIMESTAMP WHERE claim_id = ?`;

	db.query(sql, [claim_status, claim_id], (err, results) => {
		if (err) {
			console.error('Error updating claim status:', err);
			return res.status(500).send({ message: 'Something went wrong, please contact support.' });
		}
		if (results.affectedRows === 0) {
			return res.status(404).send({ message: 'Claim not found.' });
		}
		res.status(200).send({ message: 'Claim updated successfully.', success: true });
	});
});


app.delete('/deleteClaim', (req, res) => {
	const { claim_id } = req.body;

	if (!claim_id) {
		return res.status(400).send({ message: 'Missing claim ID.' });
	}

	const sql = `DELETE FROM business_claims WHERE claim_id = ?`;

	db.query(sql, [claim_id], (err, results) => {
		if (err) {
			console.error('Error deleting claim:', err);
			return res.status(500).send({ message: 'Something went wrong, please contact support.' });
		}
		if (results.affectedRows === 0) {
			return res.status(404).send({ message: 'Claim not found.' });
		}
		res.status(200).send({ message: 'Claim deleted successfully.', success: true });
	});
});



module.exports = app;