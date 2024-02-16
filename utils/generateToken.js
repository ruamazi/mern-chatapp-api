import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.SEC, {
    expiresIn: "15d",
  });

  res.cookie("jwt_token", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    secure: process.env.NODE_ENV !== "development",
  });
};
