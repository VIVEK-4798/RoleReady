const express = require('express');
const router = express.Router();
const db = require('../db');

// GET About info
router.get('/get-about/:user_id', (req, res) => {
  const userId = req.params.user_id;

  if (!userId) {
    return res.status(400).json({ message: 'user_id is required' });
  }

  const query = `SELECT about_text FROM profile_info WHERE user_id = ?`;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching About info:', err);
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No about info found', about_text: '' });
    }

    res.status(200).json({ message: 'About info retrieved successfully', about_text: results[0].about_text });
  });
});

// POST About info
router.post('/save-about', (req, res) => {
  const { user_id, about_text } = req.body;

  if (!user_id || !about_text) {
    return res.status(400).json({ message: 'user_id and about_text are required' });
  }

  const query = `
    INSERT INTO profile_info (user_id, about_text)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE about_text = VALUES(about_text)
  `;

  db.query(query, [user_id, about_text], (err, result) => {
    if (err) {
      console.error('Error saving About info:', err);
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    res.status(200).json({ message: 'Profile about info saved successfully', success: true });
  });
});

// GET Resume info
router.get('/get-resume/:user_id', (req, res) => {
  const userId = req.params.user_id;

  if (!userId) {
    return res.status(400).json({ message: 'user_id is required' });
  }

  const query = `SELECT resume_link FROM profile_info WHERE user_id = ?`;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching Resume info:', err);
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No resume info found', resume_link: '' });
    }

    res.status(200).json({ message: 'Resume info retrieved successfully', resume_link: results[0].resume_link });
  });
});

// POST Resume info
router.post('/upload-resume', (req, res) => {
  const { user_id, resume_link } = req.body;

  if (!user_id || !resume_link) {
    return res.status(400).json({ message: 'user_id and resume_link are required' });
  }

  const query = `
    INSERT INTO profile_info (user_id, resume_link)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE resume_link = VALUES(resume_link)
  `;

  db.query(query, [user_id, resume_link], (err, result) => {
    if (err) {
      console.error('Error saving Resume info:', err);
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    res.status(200).json({ message: 'Resume info saved successfully', success: true });
  });
});

module.exports = router;
