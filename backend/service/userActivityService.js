const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/login-streak/:userId', (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  const query = "SELECT date, activity_count FROM login_streaks WHERE user_id = ?";

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching streak data:", err);
      return res.status(500).json({ message: "Database error", error: err.message });
    }

    res.status(200).json(results);
  });
});

module.exports = router;
