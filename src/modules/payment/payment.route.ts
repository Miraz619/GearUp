import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { PaymentController } from "./payment.controller";

const router = Router();

router.post(
  "/create",
  auth(Role.CUSTOMER),
  PaymentController.createCheckoutSession,
);

export const PaymentRoutes = router;
