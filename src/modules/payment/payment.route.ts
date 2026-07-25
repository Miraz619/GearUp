import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { PaymentController } from "./payment.controller";

const router = Router();

router.post( "/create", auth(Role.CUSTOMER), PaymentController.createCheckoutSession,);

router.get("/", auth(Role.CUSTOMER), PaymentController.getMyPayments);

router.get("/:id", auth(Role.CUSTOMER), PaymentController.getSinglePayment);

export const PaymentRoutes = router;
