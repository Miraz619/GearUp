import app from "./app";

const port = Number(process.env.PORT) || 5000;

const startServer = async () => {
  try {
    app.listen(port, () => {
      console.log(`GearUp server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();