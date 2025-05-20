// controllers/group.controller.js

import mongoose from "mongoose";
import { Group } from "../models/group.model.js";
import { User } from "../models/user.model.js"; // Import User model for validation

export const createGroup = async (req, res) => {
  try {
    const { groupName, members } = req.body;
    console.log("createGroup req.body:", req.body); // Debug log

    // Validate groupName and members
    if (!groupName || !Array.isArray(members) || members.length < 2) {
      return res.status(400).json({
        message: "Group name and at least 2 members are required",
        success: false,
      });
    }

    // Validate ObjectIds
    const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
    if (!members.every(isValidObjectId)) {
      return res.status(400).json({
        message: "Invalid member IDs",
        success: false,
      });
    }

    // Check if users exist
    const usersExist = await User.find({ _id: { $in: members } });
    if (usersExist.length !== members.length) {
      return res.status(400).json({
        message: "Some members do not exist",
        success: false,
      });
    }

    // Create the group
    const newGroup = await Group.create({
      fullName: groupName,
      isGroup: true,
      members,
    });

    return res.status(201).json({
      group: newGroup,
      success: true,
    });
  } catch (error) {
    console.error("Create group error:", error); // Debug log
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const getGroupByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(
      "getGroupByUser userId:",
      userId,
      "req.user._id:",
      req.user._id
    ); // Debug log

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
        success: false,
      });
    }

    // Check if requested userId matches authenticated user
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({
        message: "Forbidden: You can only access your own groups",
        success: false,
      });
    }

    // Fetch groups
    const groups = await Group.find({ members: userId }).populate(
      "members",
      "-password"
    );

    return res.status(200).json({
      groups,
      success: true,
    });
  } catch (error) {
    console.error("Get groups error:", error); // Debug log
    return res.status(500).json({
      message: "Failed to fetch groups",
      success: false,
    });
  }
};
