const express = require("express")
const carsRouter = express.Router()
const {
	getAllCars,
	getOneCarById,
	createNewCar,
	deleteCarById,
	updateCarById,
} = require("../controllers/carsController")
const { carValidation } = require("../middleware/carValidation")

carsRouter.get("/test", (_req, res) => {
	res.json({
		msg: "cars route test ok !!",
	})
})

// GET return a list of all cars
carsRouter.get("/", getAllCars)

// GET one car based on its id
carsRouter.get("/:id", getOneCarById)

// POST add a new car
carsRouter.post("/", createNewCar)

// PUT update a car based on the param id
carsRouter.put("/:id", updateCarById)

// DELETE delete a car based on the param id
carsRouter.delete("/:id", deleteCarById)

module.exports = carsRouter
