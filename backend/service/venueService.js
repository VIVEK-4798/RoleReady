const express = require('express');
require('dotenv').config();
const db = require("../db");
const bcrypt = require('bcrypt');
const lodash = require('lodash');

const app = express();

	app.post('/add-venue', (req, res) => {
		const venueData = req.body;
		const query = 'INSERT INTO venues SET ?';
		
		db.query(query, venueData, (err, result) => {
			if (err) {
			console.error('Error inserting data:', err);
			return res.status(500).json({ error: err.message });
			}
			res.status(201).json({ message: 'Venue created successfully', results: true, venue : result, venueId: result.insertId, success : true });
		});
    });
  
  
    // **Read All Venues**
    app.get('/get-venue', (req, res) => {
        const { id } = req.headers;
        const { page = 1, limit = 10, search = "" } = req.query; 
    
        const offset = (page - 1) * limit; 
        const searchCondition = !lodash.isEmpty(search)
            ? `AND (venues.venue_name LIKE '%${search}%' OR user.name LIKE '%${search}%' OR user.email LIKE '%${search}%')`
            : ""; // Build search condition
    
        let query = "";
        let countQuery = "";
    
        if (!lodash.isEmpty(id)) {
            // Query for specific user
            query = `
                SELECT * 
                FROM venues 
                WHERE user_id = ${id} ${searchCondition} 
                LIMIT ${limit} OFFSET ${offset};
            `;
            countQuery = `
                SELECT COUNT(*) AS total 
                FROM venues 
                WHERE user_id = ${id} ${searchCondition};
            `;
        } else {
            // Query for all users with join
            query = `
                SELECT venues.*, user.name AS user_name, user.mobile, user.email 
                FROM venues 
                JOIN user ON venues.user_id = user.user_id 
                WHERE 1=1 ${searchCondition} 
                LIMIT ${limit} OFFSET ${offset};
            `;
            countQuery = `
                SELECT COUNT(*) AS total 
                FROM venues 
                JOIN user ON venues.user_id = user.user_id 
                WHERE 1=1 ${searchCondition};
            `;
        }
    
        // First, get the total count
        db.query(countQuery, (countErr, countResults) => {
            if (countErr) {
                console.error('Error fetching count:', countErr);
                return res.status(500).json({ error: countErr.message });
            }
    
            const totalRecords = countResults[0]?.total || 0; // Get total records
            const totalPages = Math.ceil(totalRecords / limit); // Calculate total pages
    
            // Then, execute the main query
            db.query(query, (err, results) => {
                if (err) {
                    console.error('Error fetching data:', err);
                    return res.status(500).json({ error: err.message });
                }
    
                // Respond with results, pagination info, and total pages
                res.json({
                    results,
                    success: true,
                    pagination: {
                        currentPage: parseInt(page, 10),
                        limit: parseInt(limit, 10),
                        totalPages,
                    },
                });
            });
        });
    });
  
  app.get('/search-venues', (req, res) => {
    // Extract query parameters for search and pagination
    const { 
        venue_name, 
        venue_categories, 
        venue_rate, 
        veg_package_price, 
        non_veg_package_price, 
        city_name, 
        region_name, 
        page = 1,       // Default page
        limit = 10      // Default limit per page
    } = req.query;

    // Calculate the offset for pagination
    const offset = (page - 1) * limit;

    // Build the dynamic query and parameters array for fetching data
    let query = 'SELECT * FROM venues WHERE 1=1'; // 1=1 allows adding conditions dynamically
    let countQuery = 'SELECT COUNT(*) as total FROM venues WHERE 1=1'; // For counting total results
    const queryParams = [];
    const countQueryParams = [];

    // Function to add conditions dynamically to both queries
    const addCondition = (condition, value, isJson = false) => {
        query += ` AND ${condition}`;
        countQuery += ` AND ${condition}`;
        queryParams.push(value);
        countQueryParams.push(value);
    };

    // Add conditions based on provided parameters
    if (venue_name) {
        addCondition('venue_name LIKE ?', `%${venue_name}%`);
    }
    if (venue_categories) {
        const categoriesArray = Array.isArray(venue_categories) ? venue_categories : [venue_categories];
        const categoryConditions = categoriesArray.map(() => 'JSON_CONTAINS(venue_categories, ?, "$")').join(' OR ');
        query += ` AND (${categoryConditions})`;
        countQuery += ` AND (${categoryConditions})`;

        categoriesArray.forEach(category => {
            const categoryObject = JSON.stringify({ category_name: category });
            queryParams.push(categoryObject);
            countQueryParams.push(categoryObject);
        });
    }

    if (venue_rate) {
		const { min, max } = venue_rate;
        if (min !== undefined) {
            addCondition('venue_rate >= ?', parseFloat(min));
        }
        if (max !== undefined) {
            addCondition('venue_rate <= ?', parseFloat(max));
        }
    }
    if (veg_package_price) {
		const { min, max } = veg_package_price;
        if (min !== undefined) {
            addCondition('veg_package_price >= ?', parseFloat(min));
        }
        if (max !== undefined) {
            addCondition('veg_package_price <= ?', parseFloat(max));
        }
    }
    if (non_veg_package_price) {
		const { min, max } = non_veg_package_price;
        if (min !== undefined) {
            addCondition('non_veg_package_price >= ?', parseFloat(min));
        }
        if (max !== undefined) {
            addCondition('non_veg_package_price <= ?', parseFloat(max));
        }
    }
    if (city_name) {
        addCondition('city_name LIKE ?', `%${city_name}%`);
    }
    if (region_name) {
        addCondition('region_name LIKE ?', `%${region_name}%`);
    }
    addCondition('is_enable = ?', parseInt(1));
    // Add pagination to the query
    query += ' LIMIT ? OFFSET ?';
    queryParams.push(parseInt(limit), parseInt(offset));

    // First, execute the count query to get the total number of matching records
    db.query(countQuery, countQueryParams, (err, countResult) => {
        if (err) {
            console.error('Error fetching total count:', err);
            return res.status(500).json({ error: err.message });
        }

        const totalResults = countResult[0].total;
        const totalPages = Math.ceil(totalResults / limit);

        // Execute the main query to fetch paginated data
        db.query(query, queryParams, (err, result) => {
            if (err) {
                console.error('Error fetching data:', err);
                return res.status(500).json({ error: err.message });
            }
            
            res.json({
                data: result,
                currentPage: parseInt(page),
                totalResults: totalResults,
                totalPages: totalPages,
                region_name: region_name
            });
        });
    });
});


	
  // **Read a Single Venue by ID**
  app.get('/get-venue/:id', (req, res) => {
		const { id } = req.params;
		const query = 'SELECT venues.*, user.name, user.mobile, user.email FROM venues JOIN user ON venues.user_id = user.user_id WHERE venue_id = ?;';
		
		db.query(query, [id], (err, result) => {
			if (err) {
			console.error('Error fetching data:', err);
			    return res.status(500).json({ error: err.message });
			}
			if (result.length === 0) {
			    return res.status(404).json({ message: 'Venue not found' });
			}
			res.json(result[0]);
		});
  });
  
  
  // **Update Venue by ID**
  app.post('/update-venue/:id', (req, res) => {
		const { id } = req.params;
		const updatedData = req.body;
		const query = 'UPDATE venues SET ? WHERE venue_id = ?';
		
		db.query(query, [updatedData, id], (err, result) => {
			if (err) {
			console.error('Error updating data:', err);
			return res.status(500).json({ error: err.message });
			}
			res.json({ message: 'Venue updated successfully', results : true });
		});
  });
  
  
  // **Delete Venue by ID**
	app.delete('/delete-venue/:id', (req, res) => {
		const { id } = req.params;
		const query = 'DELETE FROM venues WHERE venue_id = ?';
		
		db.query(query, [id], (err, result) => {
			if (err) {
			console.error('Error deleting data:', err);
			return res.status(500).json({ error: err.message });
			}
			res.json({ message: 'Venue deleted successfully' });
		});
	});

    app.get('/get-featured-venue', (req, res) => {
		const query = 'select * from venues where is_featured = 1 and is_enable = 1';
        db.query(query,(err,result)=>{
            if (err) {
                console.log("Error Getting featured venues");
                return res.status(500).json({ error: err.message });
            }
            return res.json({message : "Feature Venue", result: result, success : true});
        });
    });

    // **Bulk Update Venue Status (e.g., Set as Draft or Publish)**
app.put('/update-status', (req, res) => {
    const { venueIds, is_enable } = req.body;
  
    // Validation: Check if venueIds is an array and not empty
    if (!Array.isArray(venueIds) || lodash.isEmpty(venueIds)) {
      return res.status(400).json({ error: 'venueIds must be a non-empty array' });
    }
  
    // Validation: Check if is_enable is provided and is a boolean
    if (typeof is_enable !== 'boolean') {
      return res.status(400).json({ error: 'is_enable must be a boolean value' });
    }
  
    // Prepare the query to update multiple venues
    const query = `
      UPDATE venues 
      SET is_enable = ? 
      WHERE venue_id IN (${venueIds.map(() => '?').join(',')})
    `;
  
    // Combine is_enable with venueIds for the query parameters
    const queryParams = [is_enable, ...venueIds];
  
    // Execute the query
    db.query(query, queryParams, (err, result) => {
      if (err) {
        console.error('Error updating venue status:', err);
        return res.status(500).json({ error: err.message });
      }
  
      // Check if any rows were affected
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'No venues found with the provided IDs' });
      }
  
      res.json({
        message: `Successfully updated ${result.affectedRows} venue(s) status to ${is_enable ? 'Published' : 'Draft'}`,
        success: true,
        affectedRows: result.affectedRows,
      });
    });
  });

module.exports = app;