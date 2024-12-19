const { v4: uuidv4 } = require("uuid")

exports.generateRandomNumber = () => {
	// Generate a UUID
	const uuid = uuidv4()
	// Extract a portion of the UUID and convert it to an integer
	const randomInt = parseInt(uuid.replace(/-/g, "").substring(0, 8), 16)
	// Map the integer to the range [100, 10000]
	const randomNumber = 100 + (randomInt % 9010) // 901 ensures the range is inclusive of 1000
	return randomNumber
}
