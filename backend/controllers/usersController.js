const User = require("../models/users");
const bcrypt = require("bcrypt");
const { checkBody } = require("../modules/utils");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    const emailRegexValidation = /^\S+@\S+\.\S+$/;
    const passwordRegexValidation =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!checkBody(req.body, ["email", "name", "password"])) {
      return res
        .status(400)
        .json({ result: false, error: "Missing or empty fields" });
    }

    if (!emailRegexValidation.test(email)) {
      return res
        .status(400)
        .json({ result: false, error: "Please enter a valid email" });
    }

    //   if (!passwordRegexValidation.test(password)) {
    //     return res
    //       .status(400)
    //       .json({ result: false, error: "Please enter a strong password" });
    //   }

    const isUserExists = await User.findOne({ email });

    if (isUserExists) {
      return res
        .status(400)
        .json({ result: false, error: "User email already exists." });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const isRegistered = await newUser.save();

    const token = jwt.sign(
      {
        id: isRegistered._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    res.cookie("JWT", token, {
      httpOnly: true, // Cookie cannot be accessed by client side
      secure: process.env.NODE_ENV === "production", // Cookie can only be sent over https
      sameSite: "strict", // Cookie can only be sent to the same site
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ result: true, message: "User account created" });
  } catch (error) {
    console.error(error);
  }
};

exports.connect = async (req, res) => {
  const { email, password } = req.body;
  if (!checkBody(req.body, ["email", "password"])) {
    return res
      .status(400)
      .json({ result: false, error: "Missing or empty fields" });
  }

  const isUserExists = await User.findOne({ email });

  if (!isUserExists) {
    return res.status(400).json({ result: false, error: "User not found." });
  }

  if (isUserExists && bcrypt.compareSync(password, isUserExists.password)) {
    const token = jwt.sign(
      {
        id: isUserExists._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    res.cookie("JWT", token, {
      httpOnly: true, // Cookie cannot be accessed by client side
      secure: process.env.NODE_ENV === "production", // Cookie can only be sent over https
      sameSite: "strict", // Cookie can only be sent to the same site
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ result: true, message: "User connected successfully" });
  } else {
    res.status(400).json({ result: false, error: "Invalid credentials" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("JWT");
  res.json({ result: true, message: "user disconnected" });
};
