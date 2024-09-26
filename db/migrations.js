const db = require('./database'); // Requires the database connection module

// Function to create the 'contacts' table
function createContactsTable() {
  // SQL query to create the 'contacts' table if it doesn't exist
  db.run(`CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      // Log an error if the table creation fails
      console.error("Error creating the contacts table: ", err.message);
    } else {
      // Confirm success if the table is created
      console.log("Contacts table created successfully.");
    }
  });
}

// Function to create the 'areas' table
function createAreasTable() {
  // SQL query to create the 'areas' table if it doesn't exist
  db.run(`CREATE TABLE IF NOT EXISTS areas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      // Log an error if the table creation fails
      console.error("Error creating the areas table: ", err.message);
    } else {
      // Confirm success if the table is created
      console.log("Areas table created successfully.");
    }
  });
}

// Function to create the 'rides' table (each ride is associated with an area)
function createRidesTable() {
  // SQL query to create the 'rides' table if it doesn't exist
  db.run(`CREATE TABLE IF NOT EXISTS rides (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    area_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (area_id) REFERENCES areas(id)
  )`, (err) => {
    if (err) {
      // Log an error if the table creation fails
      console.error("Error creating the rides table: ", err.message);
    } else {
      // Confirm success if the table is created
      console.log("Rides table created successfully.");
    }
  });
}

// Function to run all the table migrations sequentially
function runMigrations() {
  // Use 'db.serialize' to ensure the SQL queries run in sequence
  db.serialize(() => {
    createContactsTable();  // Run the function to create the 'contacts' table
    createAreasTable();     // Run the function to create the 'areas' table
    createRidesTable();     // Run the function to create the 'rides' table
  });
}

// Export the migration function for use in other parts of the application
module.exports = { 
  runMigrations
};
