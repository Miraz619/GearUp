import { Router } from "express";
import { GearController } from "./gear.controller";

const router = Router();

router.get("/", GearController.getAllGear);
router.get("/:id", GearController.getSingleGear);
export const GearRoutes = router;