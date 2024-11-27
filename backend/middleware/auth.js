const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.cookies.JWT;

  if (!token) {
    return res.status(401).json({ result: false, error: "Not a valid token" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decodedToken;
  } catch (error) {
    console.error(error);
  }

  next();
};

module.exports = { auth };
