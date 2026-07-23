import bcrypt from "bcrypt";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { IRegisterUser } from "./auth.interface";

const registerUser = async (payload: IRegisterUser) => {
  const { name, email, password, role } = payload;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("A user already exists with this email");
  }

  if (role === "ADMIN") {
    throw new Error("You cannot register as an admin");
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