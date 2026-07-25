import cookieParser from "cookie-parser";
import cors from "cors";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import router from "./routes";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import config from "./config";
import { PaymentController } from "./modules/payment/payment.controller";
import { notFound } from './middlewares/notFound';

const app: Application = express();

app.use("/api/payments/webhook",express.raw({ type: "application/json",}), PaymentController.handleWebhook,
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: config.app_url || "*",
    credentials: true,
  }),
);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "GearUp API is running",
  });
});
app.use("/api", router);
app.use(notFound);
app.use(globalErrorHandler);
export default app;
