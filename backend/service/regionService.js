const express = require('express');
require('dotenv').config();
const db = require("../db");
const app = express();

// Create (Add a new region)
app.post('/add-regions', (req, res) => {
	const { city_id, region_name, region_pincode } = req.body;
	const query = 'INSERT INTO region (city_id, region_name, region_pincode) VALUES (?, ?, ?)';
	db.query(query, [city_id, region_name, region_pincode], (err, result) => {
		if (err) {
			res.status(500).json({ error: 'Error adding region', details: err });
		} else {
			res.status(201).json({ success : true, message: 'Region added successfully', regionId: result.insertId, success : true });
		}
	});
});

// Read (Get all regions)
app.get('/get-regions', (req, res) => {
	const query = 'SELECT * FROM region';
	db.query(query, (err, results) => {
		if (err) {
			res.status(500).json({ error: 'Error fetching regions', details: err });
		} else {
			res.status(200).json({ success:true, results });
		}
	});
});

// Read (Get a single region by ID)
app.get('/get-regions/:id', (req, res) => {
	const { id } = req.params;
	const query = 'SELECT * FROM region WHERE region_id = ?';
	db.query(query, [id], (err, result) => {
		if (err) {
			res.status(500).json({ error: 'Error fetching region', details: err });
		} else if (result.length === 0) {
			res.status(404).json({ message: 'Region not found' });
		} else {
			res.status(200).json(result[0]);
		}
	});
});

// Read (Get regions by city id)
app.get('/get-regions-by-city-id/:id', (req, res) => {
	const { id } = req.params;
	const query = 'SELECT * FROM region WHERE city_id = ?';
	db.query(query, [id], (err, result) => {
		if (err) {
			res.status(500).json({ error: 'Error fetching region', details: err });
		} else if (result.length === 0) {
			res.status(404).json({ message: 'Region not found' });
		} else {
			res.status(200).json({success : true, results: result});
		}
	});
});

// Update (Modify an existing region)
app.put('/update-regions/:id', (req, res) => {
	const { id } = req.params;
	const { city_id, region_name, region_pincode } = req.body;
	const query = 'UPDATE region SET city_id = ?, region_name = ?, region_pincode = ? WHERE region_id = ?';
	db.query(query, [city_id, region_name, region_pincode, id], (err, result) => {
		if (err) {
			res.status(500).json({ error: 'Error updating region', details: err });
		} else {
			res.status(200).json({ success : true, message: 'Region updated successfully', success : true });
		}
	});
});

// Delete (Remove a region)
app.delete('/delete-regions/:id', (req, res) => {
	const { id } = req.params;
	const query = 'DELETE FROM region WHERE region_id = ?';
	db.query(query, [id], (err, result) => {
		if (err) {
			res.status(500).json({ error: 'Error deleting region', details: err });
		} else {
			res.status(200).json({ message: 'Region deleted successfully', success : true });
		}
	});
});

module.exports = app;