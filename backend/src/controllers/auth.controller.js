import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../lib/cloudinary.js";

export const Register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(401).json({
        message: "Some fields are empty, so check it and fill it",
        success: false,
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be atleast 6 characters.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exist with this email",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 11);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    // Generate JWT token
    const tokenData = {
      userId: newUser._id,
    };

    const token = await jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res
      .status(201)
      .cookie("token", token, {
        maxage: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        // secure in production
        secure: process.env.NODE_ENV !== "development",
      })
      .json({
        message: `${newUser.fullName} created account successfully`,
        success: true,
        newUser,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Errror. Please try again later..",
      success: false,
    });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Some fields are missing, so fill it and try again later",
        success: false,
      });
    }

    const existingUser = await User.findOne({
      email,
    });
    if (!existingUser) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const tokenData = {
      userId: existingUser._id,
    };
    const token = await jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const newUser = {
      _id: existingUser._id,
      fullName: existingUser.fullName,
      email: existingUser.email,
      profilePic: existingUser.profilePic,
    };

    return res
      .cookie("token", token, {
        maxage: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: true,
        // secure in production
        secure: process.env.NODE_ENV !== "development",
      })
      .status(200)
      .json({
        message: `Welcome back ${newUser.fullName}`,
        success: true,
        newUser,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const Logout = async (req, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).status(200).json({
      message: "User loggedout successfully",
      success: true,
    });
  } catch (error) {
    console.log(errro);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.id;

    if (!profilePic) {
      return res.status(401).json({
        message: "Profile Pic is required",
        success: false,
      });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    res.status(200).json({
      message: "User is authenticated",
      success: true,
      user,
    });
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
