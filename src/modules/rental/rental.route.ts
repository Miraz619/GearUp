import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { RentalController } from "./rental.controller";

const router = Router();

router.post("/", auth(Role.CUSTOMER), RentalController.createRental);
router.get("/", auth(Role.CUSTOMER), RentalController.getMyRentals);
router.get("/:id", auth(Role.CUSTOMER), RentalController.getSingleRental);
export const RentalRoutes = router;
