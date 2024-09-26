const express = require('express');
const path = require('path'); // For handling file paths
const app = express();
const port = 5000;

// Configure the view engine and middleware
app.set('view engine', 'ejs'); // Use EJS as the templating engine
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files (CSS, JS, etc.)
app.use(express.urlencoded({ extended: true })); // Parse incoming form data
app.set('views', path.join(__dirname, 'views')); // Set the views directory

// Connect to the database and run migrations
const db = require('./db/database'); // Database connection
const { runMigrations } = require('./db/migrations'); // Migrations for tables
runMigrations(); // Run migrations on startup

// Import and use routes
const indexRouter = require('./routes/index');
app.use('/', indexRouter); // Mount the router

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`); // Confirmation message
});

// Graceful shutdown: Handle server exit and close the database connection
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing the database connection:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0); // Gracefully exit the process
  });
});
