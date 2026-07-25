

import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { Role } from "../../generated/prisma/enums";
import config from "../config";
import { prisma } from "../lib/prisma";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        name: string;
        id: string;
        role: Role;
      };
    }
  }
}

export const auth = (...requiredRoles: Role[]) => {
  return catchAsync(
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      const token =
        req.cookies.accessToken ||
        (req.headers.authorization?.startsWith("Bearer ")
          ? req.headers.authorization.split(" ")[1]
          : req.headers.authorization);

      if (!token) {
        const error = new Error(
          "You are not logged in. Please log in.",
        ) as Error & {
          statusCode: number;
        };

        error.statusCode = httpStatus.UNAUTHORIZED;

        throw error;
      }

      const verifiedToken = jwtUtils.verifyToken(
        token,
        config.jwt_access_secret,
      ) as JwtPayload;

      const { id } = verifiedToken;

      const user = await prisma.user.findUniqueOrThrow({
        where: {
          id,
        },
      });

   

      if (!user.isActive) {
        const error = new Error(
          "Your account has been suspended. Please contact support.",
        ) as Error & {
          statusCode: number;
        };

        error.statusCode = httpStatus.FORBIDDEN;

        throw error;
      }

      if (
        requiredRoles.length &&
        !requiredRoles.includes(user.role)
      ) {
        const error = new Error(
          "Forbidden. You do not have permission.",
        ) as Error & {
          statusCode: number;
        };

        error.statusCode = httpStatus.FORBIDDEN;

        throw error;
      }

      req.user = {
        email: user.email,
        name: user.name,
        id: user.id,
        role: user.role,
      };

      next();
    },
  );
};