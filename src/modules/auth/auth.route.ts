import { Router } from "express";
import { AuthController } from "./auth.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.loginUser);
router.post(
  "/google",
  AuthController.googleLogin,
);
router.get("/me", auth(), AuthController.getMe);
router.post("/refresh-token", AuthController.refreshAccessToken);
export const AuthRoutes = router;
