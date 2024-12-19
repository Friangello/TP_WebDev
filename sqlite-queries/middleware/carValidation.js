exports.carValidation = (req, res, next) => {
	const { carName, carYear, carImage } = req.body

	// alphanumeric only regex
	function isAlphanumeric(str) {
		const regex = /^[a-zA-Z0-9]+$/
		return regex.test(str)
	}

	if (!carName || !carYear || !carImage)
		return res
			.status(400)
			.json({ error: "The car name and car image are required !" })
	if (typeof carName !== "string" || typeof carImage !== "string")
		return res.status(400).json({ error: "That's a weird car name !" })
	if (!isAlphanumeric(carName) || !isAlphanumeric(carImage))
		return res.status(400).json({ error: "That name is not allowed !" })

	const message = "hello from middleware"
	res.locals.msg = message

	next()
}
