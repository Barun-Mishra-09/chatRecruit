import express from "express";
import {
  checkAuth,
  Login,
  Logout,
  Register,
  updateProfile,
} from "../controllers/auth.controller.js";

import protectedRoute from "../middlewares/protectedRoute.js";

const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.get("/logout", Logout);
router.put("/update-profile", protectedRoute, updateProfile);
// for checking auth function
router.get("/check", protectedRoute, checkAuth);

export default router;
