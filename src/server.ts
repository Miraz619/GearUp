import app from "./app";
import "dotenv/config";

import config from "./config";

const PORT = config.port;

async function main() {
  try {
  
    console.log("connected database successfully");
    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  } catch (error) {
    
    console.error("Error starting the server", error);
  
    process.exit(1);
  }
}

main();