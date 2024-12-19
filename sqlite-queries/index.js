const { checkApiKey } = require("./middleware/checkApiKey")
const carsRouter = require("./routes/carsRoutes")
const express = require("express")
const app = express()
const port = 3000
app.use(express.json())
const usersRouter = require("./routes/usersRoutes")

// CORS
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*")
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content, Accept, Content-Type, x-api-key"
	)
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, OPTIONS"
	)

	// Handle preflight requests
	if (req.method === "OPTIONS") {
		return res.sendStatus(204) // No Content
	}

	next()
})

app.get("/", (req, res) => {
	res.json({
		msg: "hello from my cars API !!",
	})
})

// API KEY CHECK
app.use("/api/cars", checkApiKey, carsRouter)
app.use("/api/users", checkApiKey, usersRouter)

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
