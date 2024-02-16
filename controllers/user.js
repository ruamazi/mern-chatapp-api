import User from "../models/userSchema.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
  }
};

export const getUsersForSidebar = async (req, res) => {
  const currentUserId = req.user._id;
  try {
    const users = await User.find({ _id: { $ne: currentUserId } }).select(
      "-password"
    );
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Somthing went wrong" });
  }
};
