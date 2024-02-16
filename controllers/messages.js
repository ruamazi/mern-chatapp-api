import Conversation from "../models/conversationSchema.js";
import Message from "../models/messageSchema.js";

export const sendMsg = async (req, res) => {
  const senderId = req.user._id;
  const { receiverId } = req.params;
  const { message } = req.body;
  try {
    let conversation = await Conversation.findOne({
      users: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
      conversation = await Conversation.create({
        users: [senderId, receiverId],
      });
    }
    const newMsg = new Message({
      message,
      senderId,
      receiverId,
    });
    if (newMsg) {
      conversation.messages.push(newMsg._id);
    }
    await Promise.all([newMsg.save(), conversation.save()]);
    return res.status(200).json(newMsg);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Somthing went wrong" });
  }
};

export const getMessages = async (req, res) => {
  const { receiverId } = req.params;
  const senderId = req.user._id;
  try {
    const conver = await Conversation.findOne({
      users: { $all: [senderId, receiverId] },
    }).populate("messages");
    if (!conver) {
      return res.status(200).json([]);
    }
    res.status(200).json(conver.messages);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Somthing went wrong" });
  }
};
