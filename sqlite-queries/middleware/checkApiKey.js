require("dotenv").config()

exports.checkApiKey = (req, res, next) => {
	// check if the api key is found in the header of the request
	const apiKey = req.header("x-api-key")

	if (apiKey && apiKey === process.env.SECRET_API_KEY) {
		next() // API key is valid, proceed to the route
	} else {
		// prevent the user from passing to the next handler
		res.status(403).json({ error: "Forbidden: Invalid API Key" })
	}
}
