import cloudinary from "../lib/cloudinary.js";
import { getReceiveSocketId, io } from "../lib/socket.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    // Logic:- get all user except yourself that you have loggedIn
    const loggedInUserId = req.id;

    // for otherUsers
    const otherUsers = await User.find({ _id: { $ne: loggedInUserId } }).select(
      "-password"
    );

    return res.status(200).json({
      message: "Other users get successfully",
      success: true,
      otherUsers,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// get messages between two users
export const getMessages = async (req, res) => {
  try {
    // SenderId == myId i.e loggedInUserId
    const myId = req.id;
    //   ReceiverId == userToChatId
    const { id: userToChatId } = req.params;

    //Logic:-  get all the message whether it is sender and receiver so we use Or method in moongoose
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        {
          senderId: userToChatId,
          receiverId: myId,
        },
      ],
    });

    return res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const sendMessages = async (req, res) => {
  try {
    // we can send messages like text, image
    const { text, image } = req.body;
    const senderId = req.id;
    const { id: receiverId } = req.params;

    let imageUrl;
    if (image) {
      // upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // todo:- realtime functionality goes here => socket.io
    const receiverSocketId = getReceiveSocketId(receiverId);
    // logic:- if the user is online then send the message in real-time
    if (receiverSocketId) {
      // here it is broadcasting to everyone so use io.to and then .emit
      // Here we are using to because this is not group chat as it is only private chat so that why we use io.to(receiverSocketId)
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(201).json({
      success: true,
      newMessage,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
