import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { RentalController } from "./rental.controller";

const router = Router();

router.get("/", auth(Role.PROVIDER), RentalController.getProviderOrders);

router.patch("/:id",auth(Role.PROVIDER),RentalController.updateStatus,
);
export const ProviderOrderRoutes = router;
