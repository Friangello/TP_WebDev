const sqlite3 = require("sqlite3").verbose()
require("dotenv").config()

// Open the database connection
const db = new sqlite3.Database(process.env.DB_FILE, (err) => {
	if (err) {
		console.error("Error opening database:", err.message)
	} else {
		console.log("Connected to the SQLite database.")

		// Create the cars table if it doesn't exist
		db.run(
			`CREATE TABLE IF NOT EXISTS cars (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        carName TEXT NOT NULL,
        carYear NUMBER NOT NULL,
        carImage TEXT NOT NULL,
		userId INTEGER NOT NULL

      )`,
			(err) => {
				if (err) {
					console.error("Error creating table:", err.message)
				}
			}
		)

		// Create the users table if it doesn't exist
		db.run(
			`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        imageUrl TEXT NOT NULL,
        email TEXT NOT NULL,
		userName TEXT NOT NULL,
		items TEXT
      )`,
			(err) => {
				if (err) {
					console.error("Error creating table:", err.message)
				}
			}
		)
	}

	// // Close the database connection
	// db.close()
})

module.exports = db
