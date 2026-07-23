import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { AuthService } from "./auth.service";

const registerUser = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
  const result = await AuthService.registerUser(req.body);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

export const AuthController = {
  registerUser,
};