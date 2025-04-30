const express = require('express');
require('dotenv').config();
const db = require("../db");
const nodemailer = require("nodemailer");

const app = express();

// Create (Add a new email record)
app.post('/add-email', (req, res) => {
    const { email_subject, email_body, recipients } = req.body;
    const query = 'INSERT INTO emails (email_subject, email_body, recipients) VALUES (?, ?, ?)';
    
    db.query(query, [email_subject, email_body, JSON.stringify(recipients)], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error adding email', details: err });
        } else {
            res.status(201).json({ message: 'Email added successfully', emailId: result.insertId, success: true });
        }
    });
});

// Read (Get all emails)
app.get('/get-emails', (req, res) => {
    const query = 'SELECT * FROM emails';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error fetching emails', details: err });
        } else {
            results.forEach(email => {
                email.recipients = JSON.parse(email.recipients || "[]"); // Parse recipients as an array
            });
            res.status(200).json({ success: true, results });
        }
    });
});

// Read (Get a single email by ID)
app.get('/get-email/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM emails WHERE email_id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error fetching email', details: err });
        } else if (result.length === 0) {
            res.status(404).json({ message: 'Email not found' });
        } else {
            result[0].recipients = JSON.parse(result[0].recipients || "[]"); // Parse recipients
            res.status(200).json(result[0]);
        }
    });
});

// Update (Modify an existing email)
app.put('/update-email/:id', (req, res) => {
    const { id } = req.params;
    const { email_subject, email_body, recipients } = req.body;
    const query = 'UPDATE emails SET email_subject = ?, email_body = ?, recipients = ? WHERE email_id = ?';
    
    db.query(query, [email_subject, email_body, JSON.stringify(recipients), id], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error updating email', details: err });
        } else {
            res.status(200).json({ message: 'Email updated successfully', success: true });
        }
    });
});

// Delete (Remove an email)
app.delete('/delete-email/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM emails WHERE email_id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error deleting email', details: err });
        } else {
            res.status(200).json({ message: 'Email deleted successfully', success: true });
        }
    });
});

// Send Bulk Emails
app.post('/send-bulk-email', async (req, res) => {
    const { emails } = req.body;

    if (!emails || emails.length === 0) {
        return res.status(400).json({ error: "No emails provided" });
    }

    // Setup email transporter (configure your email service provider here)
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER, // Your email address
            pass: process.env.EMAIL_PASS  // Your email password or app-specific password
        }
    });

    try {
        for (const email of emails) {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email.recipients.join(", "),
                subject: email.email_subject,
                html: email.email_body
            };

            await transporter.sendMail(mailOptions);
        }
        
        res.status(200).json({ message: "Bulk email sent successfully", success: true });
    } catch (error) {
        console.error("Error sending bulk email:", error);
        res.status(500).json({ error: "Error sending bulk email", details: error });
    }
});

module.exports = app;
