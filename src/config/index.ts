

import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL!,

  jwt_secret: process.env.JWT_SECRET,
  jwt_expires_in: process.env.JWT_EXPIRES_IN,

  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,

  app_url: process.env.APP_URL,
};

export default config;