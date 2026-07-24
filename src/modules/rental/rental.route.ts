import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { RentalController } from "./rental.controller";

const router = Router();

router.post(
  "/",
  auth(Role.CUSTOMER),
  RentalController.createRental,
);

export const RentalRoutes = router;