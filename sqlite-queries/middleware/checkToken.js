const jwt = require("jsonwebtoken")
require("dotenv").config()

exports.checkToken = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1]
		const decodedToken = jwt.verify(token, process.env.SECRET_PHRASE_TOKEN)
		const userId = decodedToken.id
		console.log(decodedToken.user)

		req.auth = {
			userId,
		}
		next()
	} catch (error) {
		res.status(401).json({ error })
	}
}