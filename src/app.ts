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

const app: Application = express();

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

app.use(globalErrorHandler);
export default app;