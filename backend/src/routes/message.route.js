import express from "express";
import protectedRoute from "../middlewares/protectedRoute.js";
import {
  getMessages,
  getUsersForSidebar,
  sendMessages,
} from "../controllers/message.controller.js";

const router = express.Router();

//get  user for sideBar
router.get("/otherUsers", protectedRoute, getUsersForSidebar);
// get all messages
router.get("/:id", protectedRoute, getMessages);
// for sending messages
router.post("/sendMessage/:id", protectedRoute, sendMessages);

export default router;
