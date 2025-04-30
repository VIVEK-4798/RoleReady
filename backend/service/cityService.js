const express = require('express');
require('dotenv').config();
const db = require("../db");
const app = express();

// Create (Add a new city)
app.post('/add-city', (req, res) => {
	const { city_name, city_address, city_image, is_featured } = req.body;
	const query = 'INSERT INTO city ( city_name, city_address, city_image, is_featured) VALUES (?, ?, ?, ?)';
	db.query(query, [ city_name, city_address, city_image, is_featured], (err, result) => {
		if (err) {			
			res.status(500).json({ error: 'Error adding city', details: err });
		} else {
			res.status(201).json({ message: 'city added successfully', cityId: result.insertId, success : true });
		}
	});
});

// Read (Get all cities)
app.get('/get-city', (req, res) => {
	const query = 'SELECT * FROM city';
	db.query(query, (err, results) => {
		if (err) {
			res.status(500).json({ error: 'Error fetching cities', details: err });
		} else {
			res.status(200).json({success : true, results});
		}
	});
});

// Read (t a single city by ID)
app.get('/get-city/:id', (req, res) => {
	const { id } = req.params;
	const query = 'SELECT * FROM city WHERE city_id = ?';
	db.query(query, [id], (err, result) => {
		if (err) {
			res.status(500).json({ error: 'Error fetching city', details: err });
		} else if (result.length === 0) {
			res.status(404).json({ message: 'city not found' });
		} else {
			res.status(200).json(result[0]);
		}
	});
});

// Update (Modify an existing city)
app.put('/update-city/:id', (req, res) => {
	const { id } = req.params;
	const { city_name, city_address, city_image, is_featured } = req.body;
	const query = 'UPDATE city SET city_name = ?, city_address = ?, city_image = ?, is_featured = ? WHERE city_id = ?';
	db.query(query, [ city_name, city_address, city_image, is_featured, id], (err, result) => {
		if (err) {
			res.status(500).json({ error: 'Error updating city', details: err });
		} else {
			res.status(200).json({ message: 'city updated successfully', success : true });
		}
	});
});

// Delete (Remove a city)
app.delete('/delete-city/:id', (req, res) => {
	const { id } = req.params;
	const query = 'DELETE FROM city WHERE city_id = ?';
	db.query(query, [id], (err, result) => {
		if (err) {
			res.status(500).json({ error: 'Error deleting city', details: err });
		} else {
			res.status(200).json({ message: 'city deleted successfully', success : true });
		}
	});
});

app.get('/get-featured-city', (req, res) => {
	const query = 'select * from city where is_featured = 1';
	db.query(query,(err,result)=>{
		if (err) {
			console.log("Error Getting featured city");
			return res.status(500).json({ error: err.message });
		}
		return res.json({message : "Feature City", result: result, success : true});
	});
});



module.exports = app;