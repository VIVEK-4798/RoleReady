const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/register-college", (req, res) => {
  const {
    college_name,
    first_name,
    last_name,
    email,
    phone,
    designation,
    department,
    city
  } = req.body;

  const query = `
    INSERT INTO college_registrations 
    (college_name, first_name, last_name, email, phone, designation, department, city)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [college_name, first_name, last_name, email, phone, designation, department, city],
    (err, result) => {
      if (err) {
        console.error("Error inserting college registration:", err);
        return res.status(500).send("Error saving college registration");
      }
      res.status(201).json({ message: "College registered successfully!" });
    }
  );
});

module.exports = router;
