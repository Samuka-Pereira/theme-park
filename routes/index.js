const express = require('express');
const router = express.Router();
const db = require('../db/database'); // Ensures the database connection is exported

// Home Route
router.get('/', (req, res) => {
    res.render('index', { title: 'Welcome to AdventureLand' });
});

// Areas Route
router.get('/areas', (req, res) => {
    // SQL query to retrieve areas and their rides/attractions
    const sql = `
      SELECT areas.id as area_id, areas.name as area_name, areas.description as area_description, areas.image_url,
             rides.id as ride_id, rides.name as ride_name, rides.description as ride_description
      FROM areas
      LEFT JOIN rides ON rides.area_id = areas.id
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error retrieving areas');
            return;
        }

        // Process rows to group rides by areas
        const areas = {};
        rows.forEach(row => {
            if (!areas[row.area_id]) {
                areas[row.area_id] = {
                    id: row.area_id,  // Ensure we pass the area_id for the dynamic link
                    name: row.area_name,
                    description: row.area_description,
                    image_url: row.image_url,
                    rides: []
                };
            }
            if (row.ride_id) {
                areas[row.area_id].rides.push({
                    name: row.ride_name,
                    description: row.ride_description
                });
            }
        });

        // Convert areas object to array
        const areasArray = Object.values(areas);

        // Render the areas page with the data
        res.render('areas', { title: 'Our Themed Areas', areas: areasArray });
    });
});

// Rides & Attractions Route for a Specific Area
router.get('/areas/:areaId/rides', (req, res) => {
    const areaId = req.params.areaId;  // Get the area ID from the URL

    // SQL query to retrieve the rides for the specific area, including the image URL
    const sql = `
        SELECT name, description, image_url FROM rides WHERE area_id = ?
    `;

    db.all(sql, [areaId], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error retrieving rides for the area');
            return;
        }

        // Render the rides page with the rides data
        res.render('rides', { title: `Rides & Attractions for Area ${areaId}`, rides: rows });
    });
});


// Events Route
router.get('/events', (req, res) => {
    // Retrieves all events from the database
    db.all('SELECT * FROM events', [], (err, rows) => {
        if (err) {
            console.error('Error retrieving events:', err.message); // Logs database error
            res.status(500).send('Error retrieving events');
            return;
        }
        // Renders the events page with the data
        res.render('events', { title: 'Events', events: rows });
    });
});

// Games Route
router.get('/games', (req, res) => {
    // Renders the games page
    res.render('games', { title: 'Games' });
});

// FAQ Route
router.get('/faq', (req, res) => {
    // Retrieves all FAQs from the database
    db.all('SELECT * FROM faqs', [], (err, rows) => {
        if (err) {
            console.error(err.message); // Logs database error
            res.status(500).send('Error retrieving FAQs');
            return;
        }
        // Renders the FAQ page with the data
        res.render('faq', { title: 'Frequently Asked Questions', faqs: rows });
    });
});

// Contact Us Route
router.get('/contact', (req, res) => {
    // Renders the contact page
    res.render('contact', { title: 'Contact Us' });
});

// Search Route
router.get('/search', (req, res) => {
    const query = req.query.query; // Gets the query from the request
    // Searches the database for items matching the query
    db.all('SELECT * FROM items WHERE name LIKE ?', [`%${query}%`], (err, rows) => {
      if (err) {
        console.error(err.message); // Logs any errors
        res.status(500).send('Error retrieving search results');
        return;
      }
      // Sends the results back as JSON
      res.json({ results: rows });
    });
});

// Contact form submission route
router.post('/contact', (req, res) => {
    const { name, email, message } = req.body; // Extracts form data

    // Inserts the contact message into the 'contacts' table in the database
    const sql = 'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)';
    db.run(sql, [name, email, message], (err) => {
        if (err) {
            console.error("Database error: ", err.message); // Logs any database errors
            return res.status(500).send(`Error saving your message: ${err.message}`);
        }
        // Redirects the user to the homepage upon successful submission
        res.redirect('/');
    });
});

module.exports = router; // Exports the router
