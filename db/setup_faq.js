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

// Create the FAQs table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS faqs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      answer TEXT NOT NULL
    );
  `, (err) => {
    if (err) {
      console.error('Error creating the FAQs table:', err.message);
    } else {
      console.log('FAQs table created or already exists.');
    }
  });

  // Insert some initial FAQs
  const insert = db.prepare("INSERT INTO faqs (question, answer) VALUES (?, ?)");
  
  insert.run('What are the park\'s hours?', 'The park is open every day from 9am to 7pm, April through October.');
  insert.run('Are pets allowed?', 'Unfortunately, pets are not allowed inside the park.');
  
  insert.finalize((err) => {
    if (err) {
      console.error('Error inserting initial FAQs:', err.message);
    } else {
      console.log('Initial FAQs inserted.');
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
