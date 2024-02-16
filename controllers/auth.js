import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

export const signup = async (req, res) => {
  const { fullName, username, password, gender } = req.body;
  if (
    !password ||
    !username ||
    password.trim().length === 0 ||
    username.trim().length === 0
  ) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }
  if (password.length > 20 || password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be between 6 and 20 characters" });
  }
  if (password.includes(" ")) {
    return res.status(400).json({ error: "Password format is not allowed" });
  }
  if (username.length > 20 || username.length < 3 || username.includes(" ")) {
    return res.status(400).json({
      error: "username must be between 3 and 20 letters, without empty space",
    });
  }
  if (
    !gender ||
    (gender !== "else" && gender !== "male" && gender !== "female")
  ) {
    return res.status(400).json({ error: "Wrong gender format" });
  }
  try {
    const userExist = await User.findOne({ username });
    if (userExist) {
      return res.status(400).json({ error: "User already exist" });
    }
    const salt = await bcrypt.genSalt(8);
    const hashedPsw = await bcrypt.hash(password, salt);
    const boyPic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlPic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
    const elsePic = `https://avatar.iran.liara.run/username?username=${username}`;

    const newUser = new User({
      fullName,
      username,
      password: hashedPsw,
      gender,
      profilePic:
        gender === "male" ? boyPic : gender === "female" ? girlPic : elsePic,
    });
    await newUser.save();
    generateTokenAndSetCookie(newUser._id, res);
    const { password: psw, ...userWithoutPsw } = newUser._doc;

    return res.status(201).json(userWithoutPsw);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Somthing went wrong" });
  }
};

export const signin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(401).json({ error: "wrong credentials" });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const comparePsw = await bcrypt.compare(password, user.password);
    if (!comparePsw) {
      return res.status(401).json({ error: "wrong credentials" });
    }
    generateTokenAndSetCookie(user._id, res);
    const { password: psw, ...userWithoutPsw } = user._doc;
    res.status(200).json(userWithoutPsw);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Somthing went wrong" });
  }
};

export const signout = (req, res) => {
  res.cookie("jwt_token", "", { maxAge: 0 });
  res.status(200).json({ message: "Logged out successfully" });
};
