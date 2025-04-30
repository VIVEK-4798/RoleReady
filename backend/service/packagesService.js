const express = require('express');
require('dotenv').config();
const db = require("../db");
const app = express();

// Create (Add a new package)
app.post('/add-package', (req, res) => {
    const { package_name, package_description, package_price, booking_limit, validity_days, package_image, is_featured } = req.body;
    const query = 'INSERT INTO packages (package_name, package_description, package_price, booking_limit, validity_days, package_image, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [package_name, package_description, package_price, booking_limit, validity_days, package_image, is_featured], (err, result) => {
        if (err) res.status(500).json({ error: 'Error adding package', details: err });
        else res.status(201).json({ message: 'Package added successfully', success: true });
    });
});

// Read (Get all packages)
app.get('/get-packages', (req, res) => {
    const query = 'SELECT * FROM packages';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error fetching packages', details: err });
        } else {
            res.status(200).json({ success: true, results });
        }
    });
});

// Read (Get a single package by ID)
app.get('/get-package/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM packages WHERE package_id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error fetching package', details: err });
        } else if (result.length === 0) {
            res.status(404).json({ message: 'Package not found' });
        } else {
            res.status(200).json(result[0]);
        }
    });
});

// Update (Modify an existing package)
app.put('/update-package/:id', (req, res) => {
    const { id } = req.params;
    const { package_name, package_description, package_price, booking_limit, validity_days, package_image, is_featured } = req.body;
    const query = 'UPDATE packages SET package_name=?, package_description=?, package_price=?, booking_limit=?, validity_days=?, package_image=?, is_featured=? WHERE package_id=?';
    db.query(query, [package_name, package_description, package_price, booking_limit, validity_days, package_image, is_featured, id], (err, result) => {
        if (err) res.status(500).json({ error: 'Error updating package', details: err });
        else res.status(200).json({ message: 'Package updated successfully', success: true });
    });
});

// Delete (Remove a package)
app.delete('/delete-package/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM packages WHERE package_id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error deleting package', details: err });
        } else {
            res.status(200).json({ message: 'Package deleted successfully', success: true });
        }
    });
});

// Get Featured Packages
app.get('/get-featured-packages', (req, res) => {
    const query = 'SELECT * FROM packages WHERE is_featured = 1';
    db.query(query, (err, result) => {
        if (err) {
            console.log("Error Getting featured packages");
            return res.status(500).json({ error: err.message });
        }
        return res.json({ message: "Featured Packages", result: result, success: true });
    });
});

module.exports = app;
