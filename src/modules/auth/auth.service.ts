import bcrypt from "bcrypt";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import jwt, { SignOptions } from "jsonwebtoken";
import {
  IGoogleLogin,
  ILoginUser,
  IRegisterUser,
} from "./auth.interface";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";
import httpStatus from "http-status";
import { jwtUtils } from "../../utils/jwt";

type TJwtPayload = {
  id: string;
  name: string;
  email: string;
  role: string;
};
const googleClient = new OAuth2Client();
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




const refreshToken = jwtUtils.CreateToken(
  jwtPayload,
  config.jwt_refresh_secret,
  config.jwt_refresh_expires_in as SignOptions,
);
const result = await prisma.user.findUnique({
  where: {
    id: user.id,
  },
  omit: {
    password: true,
  },
});

  return {
    accessToken,
    refreshToken,
    user: result
  };
    
};

const googleLogin = async (payload: IGoogleLogin) => {
  const { credential } = payload;

  if (!credential) {
    const error = new Error(
      "Google credential is required",
    ) as Error & {
      statusCode: number;
    };

    error.statusCode = httpStatus.BAD_REQUEST;
    throw error;
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: config.google_client_id,
  });

  const googlePayload = ticket.getPayload();

  if (
    !googlePayload ||
    !googlePayload.email ||
    !googlePayload.email_verified
  ) {
    const error = new Error(
      "Unable to verify Google account",
    ) as Error & {
      statusCode: number;
    };

    error.statusCode = httpStatus.UNAUTHORIZED;
    throw error;
  }

  const email = googlePayload.email;

  let user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  /*
    For safety, existing ADMIN and PROVIDER accounts
    continue using normal password login.
  */
  if (
    user &&
    (user.role === "ADMIN" ||
      user.role === "PROVIDER")
  ) {
    const error = new Error(
      "Please use your email and password to access this account",
    ) as Error & {
      statusCode: number;
    };

    error.statusCode = httpStatus.FORBIDDEN;
    throw error;
  }

  /*
    First Google login:
    create a CUSTOMER account automatically.
  */
 if (!user) {
  const randomPassword =
    crypto.randomBytes(32).toString("hex");

  const hashedPassword = await bcrypt.hash(
    randomPassword,
    Number(config.bcrypt_salt_rounds),
  );

  const userName =
    googlePayload.name?.trim() ||
    email.split("@")[0] ||
    "Google User";

  user = await prisma.user.create({
    data: {
      name: userName,
      email,
      password: hashedPassword,
      role: "CUSTOMER",
    },
  });
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

  const accessToken =
    jwtUtils.CreateToken(
      jwtPayload,
      config.jwt_access_secret,
      config.jwt_access_expires_in as SignOptions,
    );

  const refreshToken =
    jwtUtils.CreateToken(
      jwtPayload,
      config.jwt_refresh_secret,
      config.jwt_refresh_expires_in as SignOptions,
    );

  const safeUser =
    await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      omit: {
        password: true,
      },
    });

  return {
    accessToken,
    refreshToken,
    user: safeUser,
  };
};
const refreshAccessToken = async (refreshToken: string) => {
  if (!refreshToken) {
    const error = new Error(
      "Refresh token is required",
    ) as Error & {
      statusCode: number;
    };

    error.statusCode = httpStatus.UNAUTHORIZED;

    throw error;
  }

  const decodedToken = jwtUtils.verifyToken(
    refreshToken,
    config.jwt_refresh_secret,
  ) as TJwtPayload;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: decodedToken.id,
    },
  });

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

  return {
    accessToken,
  };
};


const getMe = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
  });



  return user;
};
export const AuthService = {
  registerUser,
  loginUser,
  googleLogin,
  getMe,
  refreshAccessToken
};