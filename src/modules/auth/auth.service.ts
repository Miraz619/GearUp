import bcrypt from "bcrypt";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { IRegisterUser } from "./auth.interface";
import httpStatus from "http-status";
const registerUser = async (payload: IRegisterUser) => {
  const { name, email, password, role } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (isUserExist) {
     const error = new Error("User is already registered") as Error & {
    statusCode: number;
  };

  error.statusCode = httpStatus.CONFLICT;

  throw error;
  }

 

   if (role === "ADMIN") {
  const error = new Error("You cannot register as an admin") as Error & {
    statusCode: number;
  };

  error.statusCode = httpStatus.BAD_REQUEST;

  throw error;
}
 

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const result = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
    omit: {
      password: true,
    },
  });

  return result;
};

export const AuthService = {
  registerUser,
};