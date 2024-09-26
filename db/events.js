const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define the path to the database
const dbPath = path.resolve(__dirname, 'theme_park.db');

// Create a new instance of the database
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Set a timeout to avoid locking issues
db.run("PRAGMA busy_timeout = 10000", (err) => {
  if (err) {
    console.error('Error setting timeout:', err.message);
  }
});

// Create the events table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      category TEXT,
      is_past BOOLEAN NOT NULL
    );
  `, (err) => {
    if (err) {
      console.error('Error creating the events table:', err.message);
    } else {
      console.log('Events table created or already exists.');
    }
  });

  // Insert some initial events
  const insert = db.prepare("INSERT INTO events (title, description, date, category, is_past) VALUES (?, ?, ?, ?, ?)");

  insert.run('Happy Day Kids Fidelity', 'Event with Min. Children’s Fidelity.', '2024-10-31', 'Scare Night', 0);
  insert.run('Summer Music Festival', 'Enjoy live music from top bands.', '2024-07-20', 'Concert', 0);
  insert.run('Winter Wonderland', 'Festive activities and holiday cheer.', '2023-12-15', 'Festival', 1);

  insert.finalize((err) => {
    if (err) {
      console.error('Error inserting initial events:', err.message);
    } else {
      console.log('Initial events inserted.');
    }
  });
});

// Close the database
db.close((err) => {
  if (err) {
    console.error('Error closing the database:', err.message);
  } else {
    console.log('Database closed.');
  }
});
