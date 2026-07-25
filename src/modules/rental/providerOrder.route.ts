import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { RentalController } from "./rental.controller";

const router = Router();

router.get("/", auth(Role.PROVIDER), RentalController.getProviderOrders);

export const ProviderOrderRoutes = router;
