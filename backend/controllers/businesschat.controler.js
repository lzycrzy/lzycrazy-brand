import mongoose from 'mongoose';
import BusinessChat from '../models/businesschat.model.js';
import { userModel } from '../models/user.model.js';
import { io } from '../server.js';
import { socketUserMap } from '../socket/socket.js';
import { sendEmail } from '../utils/sendEmail.js';
// GET BUSINESS PREVIOUSLY TALKED
export const getConnectedBusinessPartner = async (req, res) => {
  try {
    const userId = req.user._id;
    const newUserId = req.body.userId;

    if (!userId) {
      return res.status(404).json({
        message: 'Please Login First.',
        success: false,
      });
    }

    await userModel.updateOne(
      { _id: userId },
      { $addToSet: { businessConnection: newUserId } },
    );

    await userModel.updateOne(
      { _id: newUserId },
      { $addToSet: { businessConnection: userId } },
    );

    const user = await userModel
      .findById({ _id: userId })
      .populate('businessConnection');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User Not found',
      });
    }

    const partners = user.businessConnection;

    return res.status(200).json({
      success: true,
      partners,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

export const getCurrentUserDetails = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User id required',
      });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// GET MESSAGES
export const getMessages = async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.id;

    if (!senderId || !receiverId) {
      return res.status(400).json({
        success: false,
        message: 'sender and receiver required!',
      });
    }

    await BusinessChat.updateMany(
      { senderId, receiverId, isRead: false },
      { $set: { isRead: true } },
    );

    const messages = await BusinessChat.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error.',
      error: error.message,
    });
  }
};

// SEND MESSAGE
export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const senderId = req.user._id;
    const receiverId = req.params.id;

    if (!senderId || !receiverId) {
      return res.status(400).json({
        success: false,
        message: 'Sender and receiver required!',
      });
    }

    const newMessage = await BusinessChat.create({
      senderId,
      receiverId,
      text,
      isRead: false,
    });

    const sender = await userModel
      .findById(senderId)
      .populate('businessConnection');

    await userModel.updateOne(
      { _id: senderId },
      { $addToSet: { businessConnection: receiverId } },
    );

    await userModel.updateOne(
      { _id: receiverId },
      { $addToSet: { businessConnection: senderId } },
    );
    // Emit the message via socket
    const receiverSocketId = socketUserMap[receiverId];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit('chat-receive', {
        newMessage,
        sender,
      });


      return res.status(200).json({
        success: true,
        message: 'Message sent via platform',
        data: { newMessage, sender },
      });
    } else {
      const options = {
        subject: 'New Message',
        email: 'chhatish@gmail.com',
        text: text,
      };

      // sendEmail(options);

      return res.status(200).json({
        success: true,
        message: 'Message sent via email',
        options,
        data: {newMessage, sender}
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.messageId;

    if (!messageId) {
      return res.status(400).json({
        success: false,
        message: 'Message id required',
      });
    }

    const message = await BusinessChat.findByIdAndDelete(messageId, {
      new: true,
    });

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message not found',
      });
    }

    const messages = await BusinessChat.find();

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export const undreadMessage = async (req, res) => {
  try {
    const userId = req.user.id;

    const unread = await BusinessChat.aggregate([
      {
        $match: {
          receiverId: new mongoose.Types.ObjectId(userId),
          isRead: false,
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$senderId',
          count: { $sum: 1 },
          lastMessage: { $first: '$$ROOT' },
        },
      },
    ]);

    res.json({ success: true, data: unread });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export const markMessagesAsRead = async (req, res) => {
  try {
    const senderId = req.params.userId;
    const receiverId = req.user._id;

    await BusinessChat.updateMany(
      { senderId, receiverId, isRead: false },
      { $set: { isRead: true } },
    );

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error updating isRead:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const blockUser = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const userIdToBlock = req.params.userId;

    if (!currentUserId || !userIdToBlock) {
      return res.status(400).json({
        success: false,
        message: 'Both current user and target user ID are required.',
      });
    }

    const currentUser = await userModel.findById(currentUserId);
    const targetUser = await userModel.findById(userIdToBlock);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'Current user not found.',
      });
    }

    const isAlreadyRemoved =
      !currentUser.businessConnection.includes(userIdToBlock);
    const isAlreadyRemovedFromTarget =
      !currentUser.businessConnection.includes(userIdToBlock);

    if (isAlreadyRemoved) {
      return res.status(400).json({
        success: false,
        message: 'User is not in your business connections.',
      });
    }
    if (isAlreadyRemovedFromTarget) {
      return res.status(400).json({
        success: false,
        message: 'User is not in your business connections.',
      });
    }

    currentUser.businessConnection = currentUser.businessConnection.filter(
      (connId) => connId.toString() !== userIdToBlock,
    );
    targetUser.businessConnection = currentUser.businessConnection.filter(
      (connId) => connId.toString() !== userIdToBlock,
    );

    await targetUser.save();
    await currentUser.save();

    await BusinessChat.deleteMany({
      $or: [
        { senderId: currentUserId, receiverId: userIdToBlock },
        { senderId: userIdToBlock, receiverId: currentUserId }
      ]
    });

    return res.status(200).json({
      success: true,
      message: 'User removed from business connections.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};
