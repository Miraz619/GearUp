import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { GearController } from "./gear.controller";

const router = Router();

router.get("/", auth(Role.PROVIDER), GearController.getProviderGear);
router.post("/", auth(Role.PROVIDER), GearController.createGear);
router.put("/:id", auth(Role.PROVIDER), GearController.updateGear);
router.delete("/:id", auth(Role.PROVIDER), GearController.deleteGear);
export const ProviderGearRoutes = router;
