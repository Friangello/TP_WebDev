const db = require("../database")
const { generateRandomNumber } = require("../utils/randomUiGenerator")
const jwt = require("jsonwebtoken")
require("dotenv").config()

// GET all users from the database
exports.getAllUsers = (_req, res) => {
	db.all("SELECT * FROM users", [], (err, rows) => {
		if (err) {
			res.status(500).json({ error: err.message })
		} else {
			res.json(rows)
		}
	})
}

// GET one car based on its ID
exports.getOneUserById = (req, res) => {
	const { id } = req.params
	// find the user with this ID,
	db.get("SELECT * FROM users WHERE id = ?", [parseInt(id)], (err, rows) => {
		if (err) {
			return res.status(500).json({ error: err.message })
		} else {
			if (!rows) {
				return res
					.status(404)
					.json({ error: "user not found with this ID: " + id })
			} else {
				const data = {
					...rows,
					items: JSON.parse(rows.items),
				}
				return res.status(200).json(data)
			}
		}
	})
}

// POST create a new user
exports.signUp = (req, res) => {
	const { firstName, lastName, email, userName } = req.body

	const avatarUrl = `https://api.dicebear.com/5.x/pixel-art/png?seed=${encodeURIComponent(
		firstName
	)}`

	// Lancez la requête pour ajouter des voitures à la base de données.
	db.run(
		"INSERT INTO users (id, firstName,lastName, imageUrl, email, userName, items ) VALUES (?, ?, ?, ?, ?, ?, ?)",
		[
			generateRandomNumber(),
			firstName,
			lastName,
			avatarUrl,
			email,
			userName,
			JSON.stringify([]),
		],
		function (err) {
			if (err) {
				res.status(500).json({ error: err.message })
			} else {
				res.status(201).json({
					id: this.lastID,
					msg: `user created ${firstName} ${lastName}. Username: ${userName}`,
				})
			}
		}
	)
}

// POST sign In a new user
exports.logIn = (req, res) => {
	const { userName, email } = req.body
	db.get("SELECT * FROM users WHERE email = ?", [email], async (err, rows) => {
		if (err) {
			return res.status(500).json({ error: err.message })
		} else {
			if (!rows) {
				return res.status(401).json({ error: "Wrong credentials ... " })
			} else {
				const data = {
					...rows,
				}
				if (data.userName !== userName) {
					return res.status(401).json({ error: "Wrong credentials ... " })
				}

				let token = jwt.sign({ user: data }, process.env.SECRET_PHRASE_TOKEN)
				const decoded = await jwt.verify(token, process.env.SECRET_PHRASE_TOKEN)
				console.log(decoded.user.id)

				return res.json({ token, _id: decoded.user.id })
			}
		}
	})
}

// PUT modify user
exports.updateUserById = async (req, res) => {
	const userId = req.params.id
	const userDetails = req.body

	// Attempt to find the user with this ID
	db.get(
		"SELECT * FROM users WHERE id = ?",
		[parseInt(userId)],
		(err, user) => {
			if (err) {
				return res.status(500).json({ error: err.message })
			}

			if (!user) {
				return res
					.status(404)
					.json({ error: `User not found with this ID: ${userId}` })
			}

			// List of fields that can be updated
			const updatableFields = [
				"firstName",
				"lastName",
				"imageUrl",
				"email",
				"items",
			]

			// Filter and build the new user data
			const newUserData = { ...user }

			updatableFields.forEach((field) => {
				if (userDetails[field] !== undefined) {
					newUserData[field] = userDetails[field]
				}
			})

			// Generate the SET clause for the SQL query dynamically
			const updates = Object.keys(newUserData)
				.filter((key) => key !== "id") // Exclude the ID field
				.map((key) => `${key} = ?`)
				.join(", ")

			const values = Object.keys(newUserData)
				.filter((key) => key !== "id")
				.map((key) => newUserData[key])

			// Execute the update query
			db.run(
				`UPDATE users SET ${updates} WHERE id = ?`,
				[...values, userId],
				(updateErr) => {
					if (updateErr) {
						return res.status(500).json({ error: updateErr.message })
					}

					res.status(200).json({
						message: "User updated successfully!",
						updatedUser: newUserData,
					})
				}
			)
		}
	)
}

// DELETE car based on its ID
exports.deleteCarById = (req, res) => {
	const { id } = req.params

	// run the query
	db.run("DELETE FROM cars WHERE id = ?", [id], function (err) {
		if (err) {
			res.status(500).json({ error: err.message })
		} else if (this.changes === 0) {
			// if nothing found
			res.status(404).json({ message: "Car not found" })
		} else {
			// is successful
			res.status(200).json({ message: "Car deleted !" })
		}
	})
}

exports.checkUserAuth = (_req, res) => {
	res.status(200).json({ msg: "auth" })
}