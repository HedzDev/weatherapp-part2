var express = require("express");
var router = express.Router();
const { auth } = require("../middleware/auth");

const {
  addCity,
  getAllCities,
  getCityByCityName,
  deleteCityByCityName,
} = require("../controllers/weatherController");

router.post("/", auth, addCity);
router.get("/", auth, getAllCities);
router.get("/:cityName", auth, getCityByCityName);
router.delete("/:cityName", auth, deleteCityByCityName);

module.exports = router;
