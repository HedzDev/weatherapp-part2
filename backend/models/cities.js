const mongoose = require("mongoose");

const citySchema = mongoose.Schema({
  cityName: String,
  imageUrl: String,
  description: String,
  tempMin: Number,
  tempMax: Number,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

const City = mongoose.model("cities", citySchema);

module.exports = City;
