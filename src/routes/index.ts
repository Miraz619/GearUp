

import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { ProviderGearRoutes } from "../modules/gear/providerGear.route";
import { GearRoutes } from "../modules/gear/gear.route";
import { RentalRoutes } from "../modules/rental/rental.route";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/categories", CategoryRoutes);
router.use("/provider/gear", ProviderGearRoutes);
router.use("/gear", GearRoutes);
router.use("/rentals", RentalRoutes);
export default router;