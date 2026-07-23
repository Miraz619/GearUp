import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";

const Port =config.port;
const main = async () => {
  try {
    await prisma.$connect();

    console.log("Database connected successfully");

    app.listen(Port, () => {
      console.log(`GearUp server is running on port ${Port}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

main();