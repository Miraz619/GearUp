import bcrypt from "bcrypt";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import jwt, { SignOptions } from "jsonwebtoken";
import { ILoginUser, IRegisterUser } from "./auth.interface";
import httpStatus from "http-status";
import { jwtUtils } from "../../utils/jwt";
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

const loginUser = async (payload: ILoginUser) => {
  const { email, password } = payload;

  if (!email || !password) {
    const error = new Error(
      "Email and password are required",
    ) as Error & {
      statusCode: number;
    };

    error.statusCode = httpStatus.BAD_REQUEST;

    throw error;
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email,
    },
  });



  const isPasswordMatched = await bcrypt.compare(
    password,
    user.password,
  );

  if (!isPasswordMatched) {
    const error = new Error(
      "Invalid email or password",
    ) as Error & {
      statusCode: number;
    };

    error.statusCode = httpStatus.UNAUTHORIZED;

    throw error;
  }

  if (!user.isActive) {
    const error = new Error(
      "Your account has been suspended",
    ) as Error & {
      statusCode: number;
    };

    error.statusCode = httpStatus.FORBIDDEN;

    throw error;
  }

 

  const jwtPayload = {
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
};

const accessToken = jwtUtils.CreateToken(
  jwtPayload,
  config.jwt_access_secret,
  config.jwt_access_expires_in as SignOptions,
);
// console.log(accessToken);

  return {
    accessToken};
    
};

export const AuthService = {
  registerUser,
  loginUser
};