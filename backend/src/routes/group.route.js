import express from "express";

import protectedRoute from "../middlewares/protectedRoute.js";
import {
  createGroup,
  getGroupByUser,
} from "../controllers/group.controller.js";

const router = express.Router();

router.post("/createGroup", protectedRoute, createGroup);
// for getting groups for a user
router.get("/:userId", protectedRoute, getGroupByUser);

export default router;
