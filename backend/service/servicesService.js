const express = require('express');
require('dotenv').config();
const db = require("../db");
const bcrypt = require('bcrypt');
const app = express();

// Create (Add a new service)
app.post('/add-service', (req, res) => {
	const { service_name, service_img, is_featured } = req.body;
	const query = 'INSERT INTO services (service_name, service_img, is_featured) VALUES (?, ?, ?)';
	db.query(query, [service_name, service_img, is_featured], (err, result) => {
			if (err) {
			res.status(500).json({ error: 'Error adding service' });
			} else {
			res.status(201).json({ message: 'Service added', serviceId: result.insertId, success : true });
			}
	});
});

// Read (Get all services)
app.get('/get-services', (req, res) => {
	const query = 'SELECT * FROM services';
	db.query(query, (err, results) => {
		if (err) {
			res.status(500).json({ error: 'Error fetching services' });
		} else {
			res.status(200).json({success : true, results});
		}
	});
});

// Read (Get all services)
app.get('/get-featured-services', (req, res) => {
	const query = 'SELECT * FROM services WHERE is_featured = 1';
	db.query(query, (err, results) => {
		if (err) {
			res.status(500).json({ error: 'Error fetching services' });
		} else {
			res.status(200).json({success : true, results});
		}
	});
});


// Update (Modify an existing service)
app.put('/update-services/:id', (req, res) => {
	const { id } = req.params;
	const { service_name, service_img, is_featured } = req.body;
	const query = 'UPDATE services SET service_name = ?, service_img = ?, is_featured = ? WHERE service_id = ?';
	db.query(query, [service_name, service_img, is_featured, id], (err, result) => {
		if (err) {
			res.status(500).json({ error: 'Error updating service' });
		} else {
			res.status(200).json({ message: 'Service updated', success : true });
		}
	});
});

// Delete (Remove a service)
app.delete('/delete-services/:id', (req, res) => {
	const { id } = req.params;
	const query = 'DELETE FROM services WHERE service_id = ?';
	db.query(query, [id], (err, result) => {
		if (err) {
			res.status(500).json({ error: 'Error deleting service' });
		} else {
			res.status(200).json({ message: 'Service deleted', success : true });
		}
	});
});

module.exports = app;