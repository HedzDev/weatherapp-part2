const { capitalize } = require("../modules/utils");
const City = require("../models/cities");

exports.addCity = async (req, res) => {
  const isCityExists = await City.findOne({
    cityName: { $regex: `^${req.body.cityName}$`, $options: "i" },
    userId: req.user.id,
  });

  if (!isCityExists) {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${req.body.cityName}&appid=${process.env.API_KEY}&units=metric`
    );
    const data = await response.json();

    const newCity = new City({
      cityName: capitalize(req.body.cityName),
      description: data.weather[0].description,
      tempMin: data.main.temp_min,
      tempMax: data.main.temp_max,
      imageUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      userId: req.user.id,
    });

    await newCity.save();
    res.json({ result: true, weather: newCity });
  } else {
    res.status(400).json({ result: false, error: "City already saved" });
  }
};

exports.getAllCities = async (req, res) => {
  const weather = await City.find({ userId: req.user.id });
  res.json({ weather });
};

exports.getCityByCityName = async (req, res) => {
  const searchedWeather = await City.findOne({
    cityName: { $regex: `^${req.params.cityName}$`, $options: "i" },
  });

  if (searchedWeather) {
    res.json({ result: true, weather: searchedWeather });
  } else {
    res.json({ result: false, error: "City not found" });
  }
};

exports.deleteCityByCityName = async (req, res) => {
  const city = await City.findOne({
    cityName: { $regex: `^${req.params.cityName}$`, $options: "i" },
  });

  if (city?.userId.toString() !== req.user.id) {
    return res.json({
      result: false,
      error: "You are not allowed to delete this city",
    });
  }

  // on vérifie si la ville existe, si oui on la supprime, sinon on renvoie une erreur
  if (city) {
    await City.deleteOne({
      cityName: { $regex: `^${req.params.cityName}$`, $options: "i" },
    });
    res.json({ result: true, message: "City deleted" });
  } else {
    res.json({ result: false, error: "City not found" });
  }
};
