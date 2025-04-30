const express = require('express');
require('dotenv').config();
const db = require("../db");
const app = express();

app.get('/get-footer', (req, res) => {
	const { footerType = "" } = req.query;
	let data = {};
	const query = 'SELECT city_id, city_name from city where is_featured = 1';
	db.query(query, (err, cityData) => {
		
		if (err) {			
			res.status(500).json({ error: 'Error finding city ', details: err });
		} else {
			
			if (footerType === "venue") {
				return fetchCategory(cityData, res);
			} else if (footerType === "vendor") {
				return fetchService(cityData, res);
			}else if (footerType === "both") {
				return fetchServiceAndCategory(cityData, res);
			} else {
				return fetchCategory(cityData, res);
			}
		}
	});
});

const fetchCategory = (cityData, res) => {
	db.query("select category_id, category_name from categories", (err,categoriesData)=>{
		if (err) {
			res.status(500).json({ error: 'Error finding categories ', details: err });
		} else {
			res.status(200).json({ cityData : cityData , categoriesData : categoriesData, success : true });
		}
	})
}

const fetchService = (cityData, res) => {
	db.query("select service_id, service_name from services where is_featured = 1", (err,serviceData)=>{
		if (err) {
			res.status(500).json({ error: 'Error finding services', details: err });
		} else {
			res.status(200).json({ cityData : cityData , serviceData : serviceData, success : true });
		}
	})
}

const fetchServiceAndCategory = (cityData, res) => {
	db.query("select service_id, service_name from services where is_featured = 1", (err,serviceData)=>{
		if (err) {
			res.status(500).json({ error: 'Error finding services', details: err });
		} else {
			db.query("select category_id, category_name from categories", (err,categoriesData)=>{
				if (err) {
					res.status(500).json({ error: 'Error finding categories ', details: err });
				} else {
					res.status(200).json({ cityData : cityData , serviceData : serviceData, categoriesData : categoriesData, success : true });
				}
			})
		}
	})
}

module.exports = app;