

import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { ProviderGearRoutes } from "../modules/gear/providerGear.route";
import { GearRoutes } from "../modules/gear/gear.route";
import { RentalRoutes } from "../modules/rental/rental.route";
import { ProviderOrderRoutes } from "../modules/rental/providerOrder.route";
import { PaymentRoutes } from "../modules/payment/payment.route";
import { ReviewRoutes } from "../modules/review/review.route";
import { AdminRoutes } from "../modules/admin/admin.route";
import { ContactRoutes } from "../modules/contact/contact.route";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/categories", CategoryRoutes);
router.use("/provider/gear", ProviderGearRoutes);
router.use("/gear", GearRoutes);
router.use("/rentals", RentalRoutes);
router.use("/provider/orders", ProviderOrderRoutes);
router.use("/payments", PaymentRoutes);
router.use("/reviews", ReviewRoutes);
router.use("/admin", AdminRoutes);
router.use(
  "/contact",
  ContactRoutes,
);
export default router;